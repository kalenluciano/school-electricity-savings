const Router = require('express').Router();
const CalculatorRouter = require('./CalculatorRouter');

Router.use('/address', CalculatorRouter);

module.exports = Router;
