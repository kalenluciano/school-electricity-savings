const axios = require('axios');
require('dotenv').config();

const GetCensusTract = async (req, res, next) => {
	try {
		const streetAddress = req.params.streetAddress.replace('%20', '+');
		const city = req.params.city.replace('%20', '+');
		const state = req.params.state.replace('%20', '+');
		const zipCode = req.params.zipCode.replace('%20', '+');
		const results = await axios.get(
			`https://geocoding.geo.census.gov/geocoder/geographies/address?street=${streetAddress}&city=${city}&state=${state}&zip=${zipCode}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&format=json`
		);
		res.locals.censusTractGeographies =
			results.data.result.addressMatches[0].geographies;
		// res.status(200).json(results.data);
		next();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const GetLowIncomeByCensusTract = async (req, res, next) => {
	try {
		const censusTractGeographies = res.locals.censusTractGeographies;
		const censusTractNumber =
			censusTractGeographies['Census Tracts'][0]['GEOID'];
		const censusTractState = censusTractGeographies['States'][0]['GEOID'];
		const censusTractCounty =
			censusTractGeographies['Counties'][0]['GEOID'];
		// res.send(
		// 	`http://api.census.gov/data/2021/acs/acs5?get=NAME,S1701_C03_001E&for=tract:${censusTractNumber}&in=state:${censusTractState}+county:${censusTractCounty}&key=${process.env.API_KEY_CENSUS}`
		// );
		const results = await axios.get(
			`http://api.census.gov/data/2021/acs/acs5?get=NAME,B17001_002E&for=state:${censusTractState}&key=${process.env.API_KEY_CENSUS}`
		);
		console.log(results);
		res.send(results);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {
	GetCensusTract,
	GetLowIncomeByCensusTract
};
