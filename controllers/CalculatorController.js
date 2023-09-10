const axios = require('axios');
const { Op, literal } = require('sequelize');
require('dotenv').config();
const {
	BrownfieldSites,
	FossilFuelEmploymentMSAs,
	CoalMineCensusTracts,
	Saving,
	AddressGeosQualifications,
} = require('../models');

const getCensusTractGeographies = async (
	streetAddress,
	city,
	state,
	zipCode
) => {
	try {
		const googleResults = await axios.get(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${streetAddress}%20${city}%20${state}%20${zipCode}&key=${process.env.API_KEY_GOOGLE}`
		);
		const coordinates = googleResults.data.results[0].geometry.location;
		const censusResultsByCoordinates = await axios.get(
			`https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${coordinates.lng}&y=${coordinates.lat}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&format=json&layers=6,10,34,36,2,4,42,76`
		);
		const coordinateGeographies =
			censusResultsByCoordinates.data.result.geographies;
		const addressGeos = {
			street_address: streetAddress.replaceAll('+', ' '),
			city: city.replaceAll('+', ' '),
			state: state.replaceAll('+', ' '),
			zip_code: zipCode.replaceAll('+', ' '),
			coordinates_lng: coordinates.lng,
			coordinates_lat: coordinates.lat,
			census_tract_geoid:
				coordinateGeographies?.['Census Tracts']?.[0]?.['GEOID'] ?? null,
			census_tract_fips_code:
				coordinateGeographies?.['Census Tracts']?.[0]?.['TRACT'] ?? null,
			county_fips_code:
				coordinateGeographies?.['Census Tracts']?.[0]?.['COUNTY'] ?? null,
			msa_cbsa_code:
				coordinateGeographies?.['Metropolitan Statistical Areas']?.[0]?.[
					'CBSA'
				] ?? null,
			state_fips_code:
				coordinateGeographies?.['Census Tracts']?.[0]?.['STATE'] ?? null,
			tribal_census_tract_fips_code:
				coordinateGeographies?.['Tribal Census Tracts']?.[0]?.['TTRACT'] ??
				null,
			tribal_census_block_fips_code:
				coordinateGeographies?.['Tribal Block Groups']?.[0]?.['TBLKGRP'] ??
				null,
			off_reservation_aiannh_code:
				coordinateGeographies?.['Off-Reservation Trust Lands']?.[0]?.[
					'AIANNH'
				] ?? null,
			reservation_aiannh_code:
				coordinateGeographies?.['Federal American Indian Reservations']?.[0]?.[
					'AIANNH'
				] ?? null,
			alaska_native_village_aiannh_code:
				coordinateGeographies?.[
					'Alaska Native Village Statistical Areas'
				]?.[0]?.['AIANNH'] ?? null,
		};
		await AddressGeosQualifications.create(addressGeos);
		return addressGeos;
	} catch (error) {
		return error;
	}
};

const CalculateQualifications = async (req, res) => {
	try {
		const streetAddress = req.params.streetAddress.replaceAll('%20', '+');
		const city = req.params.city.replaceAll('%20', '+');
		const state = req.params.state.replaceAll('%20', '+');
		const zipCode = req.params.zipCode.replaceAll('%20', '+');
		const addressGeos = await getCensusTractGeographies(
			streetAddress,
			city,
			state,
			zipCode
		);

		res.send(addressGeos);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const GetPovertyPercentageByCensusTract = async (req, res, next) => {
	try {
		const censusTractGeographies = res.locals.censusTractGeographies;
		const censusTractNumber =
			censusTractGeographies['Census Tracts'][0]['TRACT'];
		const censusTractState =
			censusTractGeographies['Census Tracts'][0]['STATE'];
		const censusTractCounty =
			censusTractGeographies['Census Tracts'][0]['COUNTY'];
		const censusTractPovertyPercentResults = await axios.get(
			`http://api.census.gov/data/2021/acs/acs5/subject?get=NAME,S1701_C03_001E&for=tract:${censusTractNumber}&in=state:${censusTractState}%20county:${censusTractCounty}&key=${process.env.API_KEY_CENSUS}`
		);
		res.locals.censusTractPovertyPercent =
			censusTractPovertyPercentResults.data[1][1];
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const GetFamilyMedianIncomeByCensusTract = async (req, res, next) => {
	try {
		if (res.locals.censusTractPovertyPercent >= 20) {
			next();
		}
		const censusTractGeographies = res.locals.censusTractGeographies;
		const censusTractNumber =
			censusTractGeographies['Census Tracts'][0]['TRACT'];
		const censusTractState =
			censusTractGeographies['Census Tracts'][0]['STATE'];
		const censusTractCounty =
			censusTractGeographies['Census Tracts'][0]['COUNTY'];
		const censusTractMedianFamilyIncomeResults = await axios.get(
			`http://api.census.gov/data/2021/acs/acs5/subject?get=NAME,S1903_C03_015E&for=tract:${censusTractNumber}&in=state:${censusTractState}%20county:${censusTractCounty}&key=${process.env.API_KEY_CENSUS}`
		);
		res.locals.censusTractMedianFamilyIncome =
			censusTractMedianFamilyIncomeResults.data[1][1];
		if (censusTractGeographies['Metropolitan Statistical Areas']) {
			const metropolitanAreaMedianFamilyIncomeResults = await axios.get(
				`http://api.census.gov/data/2021/acs/acs5/subject?get=NAME,S1903_C03_015E&for=metropolitan%20statistical%20area/micropolitan%20statistical%20area:${censusTractGeographies['Metropolitan Statistical Areas'][0]['CBSA']}&key=${process.env.API_KEY_CENSUS}`
			);
			res.locals.metropolitanAreaMedianFamilyIncome =
				metropolitanAreaMedianFamilyIncomeResults.data[1][1];
		}
		const stateMedianFamilyIncomeResults = await axios.get(
			`http://api.census.gov/data/2021/acs/acs5/subject?get=NAME,S1903_C03_015E&for=state:${censusTractState}&key=${process.env.API_KEY_CENSUS}`
		);
		res.locals.stateMedianFamilyIncome =
			stateMedianFamilyIncomeResults.data[1][1];
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const CheckCensusTractLowIncomeStatus = async (req, res, next) => {
	try {
		if (res.locals.censusTractPovertyPercent >= 20) {
			res.locals.censusTractLowIncomeStatus = true;
		} else if (
			res.locals.censusTractMedianFamilyIncome <=
			0.8 * res.locals.stateMedianFamilyIncome
		) {
			res.locals.censusTractLowIncomeStatus = true;
		} else if (res.locals.metropolitanAreaMedianFamilyIncome) {
			if (
				res.locals.censusTractMedianFamilyIncome <=
				0.8 * res.locals.metropolitanAreaMedianFamilyIncome
			) {
				res.locals.censusTractLowIncomeStatus = true;
			} else {
				res.locals.censusTractLowIncomeStatus = false;
			}
		}
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const CheckIndianLandStatus = async (req, res, next) => {
	const censusTractGeographies = res.locals.censusTractGeographies;
	if (
		censusTractGeographies['Tribal Block Group'] ||
		censusTractGeographies['Tribal Census Tracts'] ||
		censusTractGeographies['Off-Reservation Trust Lands'] ||
		censusTractGeographies['Alaska Native Village Statistical Areas'] ||
		censusTractGeographies['Federal American Indian Reservations']
	) {
		res.locals.censusTractIndianLandStatus = true;
	} else {
		const coordinates = res.locals.coordinates;
		const coordinateCensusTract2010 = await axios.get(
			`https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${coordinates.lng}&y=${coordinates.lat}&benchmark=Public_AR_Current&vintage=Census2010_Current&format=json`
		);
		const censusTract2010Geographies =
			coordinateCensusTract2010.data.result.geographies;
		const censusTractNumber2010 =
			censusTract2010Geographies['Census Tracts'][0]['TRACT'];
		const censusTractState2010 =
			censusTract2010Geographies['Census Tracts'][0]['STATE'];
		const censusTractCounty2010 =
			censusTract2010Geographies['Census Tracts'][0]['COUNTY'];
		const populationOfCensusTract2010 = await axios.get(
			`https://api.census.gov/data/2010/dec/sf1?get=P001001&for=tract:${censusTractNumber2010}&in=state:${censusTractState2010}+county:${censusTractCounty2010}&key=${process.env.API_KEY_CENSUS}`
		);
		const populationOfCensusTractTribeMembers2010 = await axios.get(
			`https://api.census.gov/data/2010/dec/sf1?get=PCT003001&for=tract:${censusTractNumber2010}&in=state:${censusTractState2010}%20county:${censusTractCounty2010}&key=${process.env.API_KEY_CENSUS}`
		);
		if (
			populationOfCensusTractTribeMembers2010 / populationOfCensusTract2010 >=
			0.5
		) {
			res.locals.censusTractIndianLandStatus = true;
		} else {
			res.locals.censusTractIndianLandStatus = false;
		}
	}
	next();
};

const CheckBrownfieldSiteStatus = async (req, res, next) => {
	const latitudeStart = Math.floor(res.locals.coordinates.lat * 100) / 100;
	const latitudeEnd = Math.ceil(res.locals.coordinates.lat * 100) / 100;
	const longitudeStart = Math.floor(res.locals.coordinates.lng * 100) / 100;
	const longitudeEnd = Math.ceil(res.locals.coordinates.lng * 100) / 100;
	const brownfieldSiteMatches = await BrownfieldSites.findAll({
		where: literal(
			`latitude::numeric BETWEEN ${latitudeStart} AND ${latitudeEnd} AND longitude::numeric BETWEEN ${longitudeStart} AND ${longitudeEnd}`
		),
	});
	res.locals.brownfieldSites = brownfieldSiteMatches;
	if (brownfieldSiteMatches.length === 0) {
		res.locals.brownfieldSiteCredit = false;
	} else {
		res.locals.brownfieldSiteCredit = true;
	}
	next();
};

const CheckFossilFuelUnemploymentStatus = async (req, res, next) => {
	const censusTractGeographies = res.locals.censusTractGeographies;
	const censusTractState = parseInt(
		censusTractGeographies['Census Tracts'][0]['STATE']
	);
	const censusTractCounty = parseInt(
		censusTractGeographies['Census Tracts'][0]['COUNTY']
	);
	const fossilFuelUnemploymentStatusMatch =
		await FossilFuelEmploymentMSAs.findOne({
			where: {
				state_fips_code: censusTractState,
				county_fips_code: censusTractCounty,
			},
		});
	res.locals.fossilFuelUnemploymentStatusMatch =
		fossilFuelUnemploymentStatusMatch;
	if (!fossilFuelUnemploymentStatusMatch) {
		res.locals.fossilFuelUnemploymentStatusCredit = false;
	} else if (fossilFuelUnemploymentStatusMatch.msa_unemployment === false) {
		res.locals.fossilFuelUnemploymentStatusCredit = false;
	} else res.locals.fossilFuelUnemploymentStatusCredit = true;
	next();
};

const CheckCoalMineStatusByCensusTract = async (req, res, next) => {
	const censusTractGeographies = res.locals.censusTractGeographies;
	const censusTractFipsCode =
		censusTractGeographies['Census Tracts'][0]['GEOID'];
	const coalMineCensusTractMatch = await CoalMineCensusTracts.findOne({
		where: { census_tract_2020_number_fips_code: censusTractFipsCode },
	});
	res.locals.coalMineCensusTractMatch = coalMineCensusTractMatch;
	if (!coalMineCensusTractMatch) {
		res.locals.coalMineCensusTractCredit = false;
	} else {
		res.locals.coalMineCensusTractCredit = true;
	}
	next();
};

const GetSavingsDataByAddress = async (req, res, next) => {
	const allSavings = await Saving.findAll({
		include: [
			{ model: Saving, as: 'main_savings', through: { attributes: [] } },
		],
	});

	allSavings.forEach((savings) => {
		savings.main_savings.forEach((savingsObj) => {
			const index = allSavings.findIndex((item) => item.id === savingsObj.id);
			if (index !== -1) {
				allSavings.splice(index, 1);
			}
		});
	});

	if (
		res.locals.censusTractLowIncomeStatus === true ||
		res.locals.censusTractIndianLandStatus === true
	) {
		allSavings.forEach((savings) => {
			if (
				savings.item === 'Battery Storage Installation' ||
				savings.item === 'Geothermal Heating Installation' ||
				savings.item === 'Solar Panel Installation'
			) {
				savings.amount += savings.main_savings.find(
					(subSavings) =>
						subSavings.item === 'Low-Income or Native American Land Bonus'
				).amount;
			}
		});
	} else {
		allSavings.forEach((savings) => {
			if (
				savings.item === 'Battery Storage Installation' ||
				savings.item === 'Geothermal Heating Installation' ||
				savings.item === 'Solar Panel Installation'
			) {
				let index = savings.main_savings.findIndex(
					(subSavings) =>
						subSavings.item === 'Low-Income or Native American Land Bonus'
				);
				savings.main_savings.splice(index, 1);
			}
		});
	}

	if (
		res.locals.brownfieldSiteCredit === true ||
		res.locals.fossilFuelUnemploymentStatusCredit === true ||
		res.locals.coalMineCensusTractCredit === true
	) {
		allSavings.forEach((savings) => {
			if (
				savings.item === 'Battery Storage Installation' ||
				savings.item === 'Geothermal Heating Installation' ||
				savings.item === 'Solar Panel Installation'
			) {
				savings.amount += savings.main_savings.find(
					(subSavings) => subSavings.item === 'Energy Community Bonus'
				).amount;
			}
		});
	} else {
		allSavings.forEach((savings) => {
			if (
				savings.item === 'Battery Storage Installation' ||
				savings.item === 'Geothermal Heating Installation' ||
				savings.item === 'Solar Panel Installation'
			) {
				let index = savings.main_savings.findIndex(
					(subSavings) => subSavings.item === 'Energy Community Bonus'
				);
				savings.main_savings.splice(index, 1);
			}
		});
	}

	allSavings.forEach((savings) => {
		if (
			savings.item === 'Battery Storage Installation' ||
			savings.item === 'Geothermal Heating Installation' ||
			savings.item === 'Solar Panel Installation'
		) {
			savings.amount += savings.main_savings.find(
				(subSavings) => subSavings.item === 'US Material Bonus'
			).amount;
		}
	});

	res.locals.savings = allSavings;
	res.send(res.locals);
};

module.exports = {
	CalculateQualifications,
};
