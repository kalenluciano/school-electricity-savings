const axios = require('axios');
require('dotenv').config();

const GetCensusTract = async (req, res, next) => {
	try {
		const streetAddress = req.params.streetAddress.replaceAll('%20', '+');
		const city = req.params.city.replaceAll('%20', '+');
		const state = req.params.state.replaceAll('%20', '+');
		const zipCode = req.params.zipCode.replaceAll('%20', '+');
		const results = await axios.get(
			`https://geocoding.geo.census.gov/geocoder/geographies/address?street=${streetAddress}&city=${city}&state=${state}&zip=${zipCode}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&format=json&layers=6,10,34,36,2,4,42,76`
		);
		if (results.data.result.addressMatches.length < 1) {
			const googleStreetAddress = req.params.streetAddress.replaceAll(
				'+',
				'%20'
			);
			const googleCity = req.params.city.replaceAll('+', '%20');
			const googleState = req.params.state.replaceAll('+', '%20');
			const googleZipCode = req.params.zipCode.replaceAll('+', '%20');
			const googleResults = await axios.get(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${googleStreetAddress}%20${googleCity}%20${googleState}%20${googleZipCode}&key=${process.env.API_KEY_GOOGLE}`
			);
			const coordinates = googleResults.data.results[0].geometry.location;
			const coordinateResults = await axios.get(
				`https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${coordinates.lng}&y=${coordinates.lat}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&format=json&layers=6,10,34,36,2,4,42,76`
			);
			res.locals.coordinates = coordinates;
			res.locals.censusTractGeographies =
				coordinateResults.data.result.geographies;
		} else {
			res.locals.coordinates = {};
			res.locals.coordinates.lng =
				results.data.result.addressMatches[0].coordinates.x;
			res.locals.coordinates.lat =
				results.data.result.addressMatches[0].coordinates.y;
			res.locals.censusTractGeographies =
				results.data.result.addressMatches[0].geographies;
		}
		next();
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
			populationOfCensusTractTribeMembers2010 /
				populationOfCensusTract2010 >=
			0.5
		) {
			res.locals.censusTractIndianLandStatus = true;
		} else {
			res.locals.censusTractIndianLandStatus = false;
		}
	}
	res.send(res.locals);
};

module.exports = {
	GetCensusTract,
	GetPovertyPercentageByCensusTract,
	GetFamilyMedianIncomeByCensusTract,
	CheckCensusTractLowIncomeStatus,
	CheckIndianLandStatus
};
