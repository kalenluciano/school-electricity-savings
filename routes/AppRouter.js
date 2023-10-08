const Router = require('express').Router();
const CalculatorRouter = require('./CalculatorRouter');
const SavingsRouter = require('./SavingsRouter');

Router.use('/address', CalculatorRouter);
Router.use('/savings', SavingsRouter);

module.exports = Router;
