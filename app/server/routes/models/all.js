const data = require('../../data.json');


module.exports = (req, res) => {
  var models = data.models;

  res.status(200).json({ models });
};