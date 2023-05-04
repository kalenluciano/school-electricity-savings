const Router = require('express').Router();
const AddressRouter = require('./AddressRouter');

Router.use('/address', AddressRouter);

module.exports = Router;
