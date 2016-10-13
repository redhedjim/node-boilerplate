var models = require('express').Router();
var all = require('./all');

models.get('/', all);

var single = require('./single');

models.get('/:modelId', single);

var cars = require('./cars');

models.use('/:modelId/cars', cars);

var data = require('../../data.json');

models.param('modelId', (req, res, next, value) => {
  var model = data.models.find(m => m.id === (value * 1));

  if (model) {
    req['model'] = model;
    next();
  } else {
    res.status(404).send('Invalid model ID');
  }
});

module.exports = models;