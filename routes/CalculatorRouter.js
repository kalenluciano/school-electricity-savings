const Router = require('express').Router();
const CalculatorController = require('../controllers/CalculatorController');

Router.get(
	'/:streetAddress/:city/:state/:zipCode',
	CalculatorController.CalculateQualifications
);

module.exports = Router;
