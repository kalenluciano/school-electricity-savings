const axios = require('axios');
require('dotenv').config();

const GetCensusTract = async (req, res, next) => {
	try {
		const streetAddress = req.params.streetAddress.replace('%20', '+');
		const city = req.params.city.replace('%20', '+');
		const state = req.params.state.replace('%20', '+');
		const zipCode = req.params.zipCode.replace('%20', '+');
		const results = await axios.get(
			`https://geocoding.geo.census.gov/geocoder/geographies/address?street=${streetAddress}&city=${city}&state=${state}&zip=${zipCode}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&format=json&layers=6,10,34,36,2,4,42,76`
		);
		if (results.data.result.addressMatches.length < 1) {
			res.send('no matches');
		} else {
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
			`http://api.census.gov/data/2021/acs/acs5/subject?get=NAME,S1701_C03_001E&&for=tract:${censusTractNumber}&in=state:${censusTractState}%20county:${censusTractCounty}&key=${process.env.API_KEY_CENSUS}`
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
			}
		}
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const CheckIndianLandStatus = async (req, res, next) => {
	res.send(res.locals);
};

module.exports = {
	GetCensusTract,
	GetPovertyPercentageByCensusTract,
	GetFamilyMedianIncomeByCensusTract,
	CheckCensusTractLowIncomeStatus,
	CheckIndianLandStatus
};
