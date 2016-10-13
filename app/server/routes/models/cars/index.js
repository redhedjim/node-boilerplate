var cars = require('express').Router({ mergeParams: true });
var all = require('./all');

cars.get('/', all);

module.exports = cars;