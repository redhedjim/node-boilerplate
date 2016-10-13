var cars = require('express').Router();
var all = require('./all');
var single = require('./single');

cars.get('/', all);
cars.get('/:carId', single);

const data = require('../../data.json');

cars.param('carId', (req, res, next, value) => {
  const car = data.cars.find(c => c.id === (value * 1));

  if (car) {
    req['car'] = car;
    next();
  } else {
    res.status(404).send('Invalid car ID');
  }
});

module.exports = cars;