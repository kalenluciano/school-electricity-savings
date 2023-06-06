const Router = require('express').Router();
const AddressRouter = require('./AddressRouter');
const SavingsRouter = require('./SavingsRouter');

Router.use('/address', AddressRouter);
Router.use('/savings', SavingsRouter);

module.exports = Router;
