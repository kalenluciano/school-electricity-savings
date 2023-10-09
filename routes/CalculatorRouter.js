const Router = require('express').Router();
const CalculatorController = require('../controllers/CalculatorController');

Router.get(
	'/:address/:coordinatesLat/:coordinatesLng',
	CalculatorController.CalculateQualifications
);

module.exports = Router;
