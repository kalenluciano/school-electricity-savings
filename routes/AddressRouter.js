const Router = require('express').Router();
const AddressController = require('../controllers/AddressController');

Router.get(
	'/:streetAddress/:city/:state/:zipCode',
	AddressController.GetCensusTract,
	AddressController.GetPovertyPercentageByCensusTract,
	AddressController.GetFamilyMedianIncomeByCensusTract,
	AddressController.CheckCensusTractLowIncomeStatus,
	AddressController.CheckIndianLandStatus
);

module.exports = Router;
