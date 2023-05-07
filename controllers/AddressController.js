const axios = require('axios');

const GetCensusTract = async (req, res, next) => {
	try {
		const streetAddress = req.params.streetAddress.replace('%20', '+');
		const city = req.params.city.replace('%20', '+');
		const state = req.params.state.replace('%20', '+');
		const zipCode = req.params.zipCode.replace('%20', '+');
		// res.send('success');
		const results = await axios.get(
			`https://geocoding.geo.census.gov/geocoder/geographies/address?street=${streetAddress}&city=${city}&state=${state}&zip=${zipCode}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&format=json`
		);
		res.status(200).json(results.data);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {
	GetCensusTract
};
