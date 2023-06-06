const Router = require('express').Router();
const SavingsController = require('../controllers/SavingsController');

Router.get('/', SavingsController.GetSavingsBaseline);

module.exports = Router;
