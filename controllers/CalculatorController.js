const axios = require('axios');
const { Op, literal, where } = require('sequelize');
require('dotenv').config();
const {
	BrownfieldSites,
	FossilFuelEmploymentMSAs,
	CoalMineCensusTracts,
	AddressGeosQualifications,
	SolarGeoBatteryStats,
	NonattainmentAreas,
	SchoolDistrictGeographies,
	PrioritizedCleanBusSchools,
	SelfCertifiableDistricts,
	ElectricVehicleStats,
	DisadvantagedCommunities,
	EVChargerStats,
} = require('../models');

const getCensusTractGeographies = async (
	address,
	coordinatesLat,
	coordinatesLng
) => {
	try {
		let coordinates;
		if (coordinatesLat.length === 0 && coordinatesLng.length === 0) {
			const googleResults = await axios.get(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.API_KEY_GOOGLE}`
			);
			coordinates = googleResults.data.results[0].geometry.location;
			coordinatesLat = coordinates.lat;
			coordinatesLng = coordinates.lng;
		}
		const censusResultsByCoordinates = await axios.get(
			`https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${coordinatesLng}&y=${coordinatesLat}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&format=json&layers=6,10,34,36,2,4,42,76`
		);
		const coordinateGeographies =
			censusResultsByCoordinates.data.result.geographies;
		const formattedAddress = address.replaceAll('%2C', ',').split(',');
		const addressGeosData = {
			street_address: formattedAddress[0].trim(),
			city: formattedAddress[1].trim(),
			state: formattedAddress[2].trim().slice(0, -5).trim(),
			zip_code: formattedAddress[2].trim().slice(-5).trim(),
			coordinates_lng: coordinatesLng,
			coordinates_lat: coordinatesLat,
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
		const addressGeos = await AddressGeosQualifications.create(addressGeosData);
		return addressGeos;
	} catch (error) {
		console.log('Error getting geographies: ', error.message);
		return { error: error.message };
	}
};

const get2010CensusTractGeographies = async (
	coordinatesLat,
	coordinatesLng
) => {
	const coordinateCensusTract2010 = await axios.get(
		`https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${coordinatesLng}&y=${coordinatesLat}&benchmark=Public_AR_Current&vintage=Census2010_Current&format=json`
	);
	const censusTract2010Geographies =
		coordinateCensusTract2010.data.result.geographies;
	return censusTract2010Geographies;
};

const getLowIncomeStats = async (
	censusTractNumber,
	censusTractCounty,
	censusTractState,
	msaCbsaCode
) => {
	try {
		const lowIncomeStats = {};

		// Get census tract poverty rate and family median income
		const censusTractIncomeResults = await axios.get(
			`http://api.census.gov/data/2021/acs/acs5/subject?get=NAME,S1701_C03_001E,S1903_C03_015E&for=tract:${censusTractNumber}&in=state:${censusTractState}%20county:${censusTractCounty}&key=${process.env.API_KEY_CENSUS}`
		);
		lowIncomeStats.census_tract_poverty_rate =
			censusTractIncomeResults?.data?.[1]?.[1];
		lowIncomeStats.census_tract_family_median_income =
			censusTractIncomeResults?.data?.[1]?.[2];

		// If the poverty rate is low and address is in a metro area, get MSA family median income
		if (lowIncomeStats.census_tract_poverty_rate < 20 && msaCbsaCode !== null) {
			const metropolitanAreaMedianFamilyIncomeResults = await axios.get(
				`http://api.census.gov/data/2021/acs/acs5/subject?get=NAME,S1903_C03_015E&for=metropolitan%20statistical%20area/micropolitan%20statistical%20area:${msaCbsaCode}&key=${process.env.API_KEY_CENSUS}`
			);
			lowIncomeStats['metro_area_family_median_income'] =
				metropolitanAreaMedianFamilyIncomeResults.data[1][1];
		}

		// Get state median family income
		const stateMedianFamilyIncomeResults = await axios.get(
			`http://api.census.gov/data/2021/acs/acs5/subject?get=NAME,S1903_C03_015E&for=state:${censusTractState}&key=${process.env.API_KEY_CENSUS}`
		);
		lowIncomeStats.state_family_median_income =
			stateMedianFamilyIncomeResults.data[1][1];

		// Check low income status
		if (lowIncomeStats.census_tract_poverty_rate >= 20) {
			lowIncomeStats.low_income_status = true;
		} else if (
			lowIncomeStats.census_tract_family_median_income <=
			0.8 * lowIncomeStats.state_family_median_income
		) {
			lowIncomeStats.low_income_status = true;
		} else if (msaCbsaCode !== null) {
			if (
				lowIncomeStats.census_tract_family_median_income <=
				0.8 * lowIncomeStats['metro_area_family_median_income']
			) {
				lowIncomeStats.low_income_status = true;
			}
		} else {
			lowIncomeStats.low_income_status = false;
		}
		return lowIncomeStats;
	} catch (error) {
		console.log('Error getting poverty rate by census tract: ', error.message);
		return { error: error.message };
	}
};

const getIndianLandStats = async (
	tribalBlockGroup,
	tribalCensusTract,
	offReservationTrustLands,
	alaskaNativeVillageStatAreas,
	federalAmericanIndianReservation,
	censusTract2010Geographies
) => {
	const indianLandStats = {};

	if (
		tribalBlockGroup ||
		tribalCensusTract ||
		offReservationTrustLands ||
		alaskaNativeVillageStatAreas ||
		federalAmericanIndianReservation
	) {
		// Set Indian land stats
		indianLandStats.indian_land_status = true;
		if (federalAmericanIndianReservation) {
			indianLandStats.federal_american_indian_reservation = true;
		} else {
			indianLandStats.federal_american_indian_reservation = false;
		}
		if (offReservationTrustLands) {
			indianLandStats.off_reservation_trust_land = true;
		} else {
			indianLandStats.off_reservation_trust_land = false;
		}
		if (alaskaNativeVillageStatAreas) {
			indianLandStats.alaska_native_village = true;
		} else {
			indianLandStats.alaska_native_village = false;
		}
	} else {
		// If Indian land status is still false, check if the census tract has a majority of the population enrolled in a Tribe
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

		// Calculate if there is a majority of the population enrolled in a Tribe
		if (
			populationOfCensusTractTribeMembers2010 / populationOfCensusTract2010 >=
			0.5
		) {
			indianLandStats.majority_tribe_members = true;
			indianLandStats.indian_land_status = true;
		} else {
			indianLandStats.majority_tribe_members = false;
			indianLandStats.indian_land_status = false;
		}
	}

	return indianLandStats;
};

const getBrownfieldSiteStats = async (coordinatesLat, coordinatesLng) => {
	const brownfieldSiteStats = {};
	const latitudeStart = Math.floor(coordinatesLat * 100) / 100;
	const latitudeEnd = Math.ceil(coordinatesLat * 100) / 100;
	const longitudeStart = Math.floor(coordinatesLng * 100) / 100;
	const longitudeEnd = Math.ceil(coordinatesLng * 100) / 100;
	const brownfieldSiteMatches = await BrownfieldSites.findAll({
		where: literal(
			`latitude::numeric BETWEEN ${latitudeStart} AND ${latitudeEnd} AND longitude::numeric BETWEEN ${longitudeStart} AND ${longitudeEnd}`
		),
	});
	if (brownfieldSiteMatches.length === 0) {
		brownfieldSiteStats.brownfield_site_status = false;
	} else {
		brownfieldSiteStats.brownfield_site_status = true;
	}
	return brownfieldSiteStats;
};

const getFossilFuelUnemploymentStats = async (
	countyFipsCode,
	stateFipsCode
) => {
	const fossilFuelUnemploymentStats = {};
	const fossilFuelUnemploymentStatusMatch =
		await FossilFuelEmploymentMSAs.findOne({
			where: {
				state_fips_code: stateFipsCode,
				county_fips_code: countyFipsCode,
			},
		});
	if (!fossilFuelUnemploymentStatusMatch) {
		fossilFuelUnemploymentStats.fossil_fuel_employment_status = false;
	} else if (fossilFuelUnemploymentStatusMatch.msa_unemployment === false) {
		fossilFuelUnemploymentStats.fossil_fuel_employment_status = false;
		fossilFuelUnemploymentStats.msa_non_msa_name =
			fossilFuelUnemploymentStatusMatch.msa_non_msa_name;
		fossilFuelUnemploymentStats.msa_non_msa_unemployment_rate =
			fossilFuelUnemploymentStatusMatch.msa_unemployment_value;
	} else {
		fossilFuelUnemploymentStats.fossil_fuel_employment_status = true;
		fossilFuelUnemploymentStats.msa_non_msa_name =
			fossilFuelUnemploymentStatusMatch.msa_non_msa_name;
		fossilFuelUnemploymentStats.msa_non_msa_unemployment_rate =
			fossilFuelUnemploymentStatusMatch.msa_unemployment_value;
	}

	return fossilFuelUnemploymentStats;
};

const getCoalMineStatus = async (censusTractGeoId) => {
	const coalMineStats = {};
	const coalMineCensusTractMatch = await CoalMineCensusTracts.findOne({
		where: { census_tract_2020_number_fips_code: censusTractGeoId },
	});
	if (!coalMineCensusTractMatch) {
		coalMineStats.coal_mine_status = false;
	} else {
		coalMineStats.coal_mine_status = true;
	}
	return coalMineStats;
};

const calculateSolarGeoBatteryStats = async (
	addressGeos,
	solarGeoBatteryData
) => {
	// Calculate credits
	solarGeoBatteryData.base_credit = 30;
	solarGeoBatteryData.additional_credit = 0;
	if (
		solarGeoBatteryData.low_income_status ||
		solarGeoBatteryData.indian_land_status
	) {
		solarGeoBatteryData.additional_credit += 10;
	}
	if (
		solarGeoBatteryData.coal_mine_status ||
		solarGeoBatteryData.fossil_fuel_employment_status ||
		solarGeoBatteryData.brownfield_site_status
	) {
		solarGeoBatteryData.additional_credit += 10;
	}
	solarGeoBatteryData.total_tax_credit =
		solarGeoBatteryData.additional_credit + solarGeoBatteryData.base_credit;

	// Store calculations and data
	const solarGeoBatterStats = await SolarGeoBatteryStats.create(
		solarGeoBatteryData
	);
	await AddressGeosQualifications.update(
		{
			solar_geo_battery_id: solarGeoBatterStats.id,
		},
		{ where: { id: addressGeos.id } }
	);
	return solarGeoBatterStats;
};

const getNonattainmentStatus = async (countyFipsCode, stateFipsCode) => {
	try {
		const nonattainmentAreas = await NonattainmentAreas.findAll({
			where: {
				fips_cnty: countyFipsCode,
				fips_state: stateFipsCode,
			},
		});
		if (nonattainmentAreas.length > 0) {
			return { poor_air_quality_area: false };
		} else {
			return { poor_air_quality_area: true };
		}
	} catch (error) {
		console.log(
			'Error getting nonattainment status for school: ',
			error.message
		);
		return { error: error.message };
	}
};

const getSchoolDistrictId = async (censusTractGeoId) => {
	try {
		const schoolDistrict = await SchoolDistrictGeographies.findOne({
			where: {
				tract: censusTractGeoId,
			},
		});
		return schoolDistrict.lea_id;
	} catch (error) {
		console.log('Error getting school district id: ', error.message);
		return { error: error.message };
	}
};

const getCleanBusProgramStats = async (schoolDistrictId) => {
	const cleanBusProgramStats = {};
	const prioritizedSchool = await PrioritizedCleanBusSchools.findOne({
		where: { nces_id: schoolDistrictId },
	});
	if (prioritizedSchool === null) {
		cleanBusProgramStats.prioritized_clean_bus_school = false;
		const selfCertifiableSchool = await SelfCertifiableDistricts.findOne({
			where: { nces_id: schoolDistrictId },
		});
		cleanBusProgramStats.self_certifiable_clean_bus_school =
			selfCertifiableSchool === null ? false : true;
	} else {
		cleanBusProgramStats.prioritized_clean_bus_school = true;
		cleanBusProgramStats.high_need_school =
			prioritizedSchool.high_need === 'Yes' ? true : false;
		cleanBusProgramStats.rural_school =
			prioritizedSchool.rural === 'Yes' ? true : false;
		cleanBusProgramStats.school_with_children_on_indian_land =
			prioritizedSchool.school_with_children_on_indian_land === 'Yes'
				? true
				: false;
		cleanBusProgramStats.bureau_funded_school =
			prioritizedSchool.bureau_funded_school === 'Yes' ? true : false;
	}
	return cleanBusProgramStats;
};

// Calculate electric vehicle stats
const calculateElectricVehicleStats = async (
	addressGeos,
	electricVehicleData
) => {
	electricVehicleData.available_grants = 3;

	// Store calculations and data
	const electricVehicleStats = await ElectricVehicleStats.create(
		electricVehicleData
	);
	await AddressGeosQualifications.update(
		{
			electric_vehicles_id: electricVehicleStats.id,
		},
		{ where: { id: addressGeos.id } }
	);
	return electricVehicleStats;
};

// Get disadvantaged community status
const getDisadvantagedCommunityStatus = async (censusTract2010Geographies) => {
	const censusTractGeoId =
		censusTract2010Geographies['Census Tracts'][0]['GEOID'];
	const disadvantagedCommunity = await DisadvantagedCommunities.findOne({
		where: { census_tract_id_2010: censusTractGeoId },
	});
	if (disadvantagedCommunity === null) {
		return { disadvantaged_community: false };
	} else {
		return { disadvantaged_community: true };
	}
};

const calculateEvChargerStats = async (addressGeos, evChargerData) => {
	evChargerData.available_grants = 2;

	// Store calculations and data
	const evChargerStats = await EVChargerStats.create(evChargerData);
	await AddressGeosQualifications.update(
		{
			ev_chargers_id: evChargerStats.id,
		},
		{ where: { id: addressGeos.id } }
	);
	return evChargerStats;
};

const getAddressGeosQualifications = async (addressGeosId) => {
	const addressGeosQualifications = await AddressGeosQualifications.findOne({
		where: { id: addressGeosId },
		include: [
			{ model: SolarGeoBatteryStats, as: 'SolarGeoBatteryStat' },
			{ model: ElectricVehicleStats, as: 'ElectricVehicleStat' },
			{ model: EVChargerStats, as: 'EVChargerStat' },
		],
	});
	return addressGeosQualifications;
};

const CalculateQualifications = async (req, res) => {
	try {
		// Get census tract geographies
		const address = req.params.address;
		let coordinatesLat = req.params.coordinatesLat;
		let coordinatesLng = req.params.coordinatesLng;
		const addressGeos = await getCensusTractGeographies(
			address,
			coordinatesLat,
			coordinatesLng
		);

		// Get 2010 census tract geographies
		coordinatesLat = addressGeos.coordinates_lat;
		coordinatesLng = addressGeos.coordinates_lng;
		const censusTract2010Geographies = await get2010CensusTractGeographies(
			coordinatesLat,
			coordinatesLng
		);

		// Get low income stats
		const censusTractFipsCode = addressGeos.census_tract_fips_code;
		const countyFipsCode = addressGeos.county_fips_code;
		const stateFipsCode = addressGeos.state_fips_code;
		const msaCbsaCode = addressGeos?.msa_cbsa_code ?? null;
		const lowIncomeStats = await getLowIncomeStats(
			censusTractFipsCode,
			countyFipsCode,
			stateFipsCode,
			msaCbsaCode
		);

		// Get Indian land stats
		const tribalBlockGroup = addressGeos.tribal_census_block_fips_code;
		const tribalCensusTract = addressGeos.tribal_census_tract_fips_code;
		const offReservationTrustLands = addressGeos.off_reservation_aiannh_code;
		const alaskaNativeVillageStatAreas =
			addressGeos.alaska_native_village_aiannh_code;
		const federalAmericanIndianReservation =
			addressGeos.reservation_aiannh_code;
		const indianLandStats = await getIndianLandStats(
			tribalBlockGroup,
			tribalCensusTract,
			offReservationTrustLands,
			alaskaNativeVillageStatAreas,
			federalAmericanIndianReservation,
			censusTract2010Geographies
		);

		// Get brownfield site stats
		const brownfieldSiteStats = await getBrownfieldSiteStats(
			coordinatesLat,
			coordinatesLng
		);

		// Get fossil fuel unemployment stats
		const fossilFuelUnemploymentStats = await getFossilFuelUnemploymentStats(
			countyFipsCode,
			stateFipsCode
		);

		// Get coal mine stats
		const censusTractGeoId = addressGeos.census_tract_geoid;
		const coalMineStats = await getCoalMineStatus(censusTractGeoId);

		// Calculate and store solar/geo/battery data
		const solarGeoBatteryData = {
			...lowIncomeStats,
			...indianLandStats,
			...brownfieldSiteStats,
			...fossilFuelUnemploymentStats,
			...coalMineStats,
		};
		await calculateSolarGeoBatteryStats(addressGeos, solarGeoBatteryData);

		// Get nonattainment status
		const nonattainmentStatus = await getNonattainmentStatus(
			countyFipsCode,
			stateFipsCode
		);

		// Get school district id
		const schoolDistrictId = await getSchoolDistrictId(censusTractGeoId);

		// Get clean bus program stats
		const cleanBusProgramStats = await getCleanBusProgramStats(
			schoolDistrictId
		);

		// Calculate and store electric vehicle stats
		const electricVehicleData = {
			...nonattainmentStatus,
			...cleanBusProgramStats,
		};
		await calculateElectricVehicleStats(addressGeos, electricVehicleData);

		// Get disadvantaged community status
		const disadvantagedCommunityStatus = await getDisadvantagedCommunityStatus(
			censusTract2010Geographies
		);

		// Calculate and store EV charger stats
		const evChargerData = {
			...nonattainmentStatus,
			...disadvantagedCommunityStatus,
		};
		await calculateEvChargerStats(addressGeos, evChargerData);

		// Get updated address geos qualifications
		const addressGeosQualifications = await getAddressGeosQualifications(
			addressGeos.id
		);

		res.send(addressGeosQualifications);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {
	CalculateQualifications,
};
