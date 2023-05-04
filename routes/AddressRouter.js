const Router = require('express').Router();
const AddressController = require('../controllers/AddressController');

Router.get(
	'/:streetAddress/:city/:state/:zipCode',
	AddressController.GetCensusTract
);

module.exports = Router;
