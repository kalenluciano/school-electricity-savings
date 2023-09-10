const Router = require('express').Router();
const AddressController = require('../controllers/AddressController');

Router.get(
	'/:streetAddress/:city/:state/:zipCode',
	AddressController.CalculateQualifications
	// AddressController.GetCensusTractGeographies
	// AddressController.GetPovertyPercentageByCensusTract,
	// AddressController.GetFamilyMedianIncomeByCensusTract,
	// AddressController.CheckCensusTractLowIncomeStatus,
	// AddressController.CheckIndianLandStatus,
	// AddressController.CheckBrownfieldSiteStatus,
	// AddressController.CheckFossilFuelUnemploymentStatus,
	// AddressController.CheckCoalMineStatusByCensusTract,
	// AddressController.GetSavingsDataByAddress
);

module.exports = Router;
