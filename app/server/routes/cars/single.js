const data = require('../../data.json');

module.exports = (req, res) => {
  var carId = req.params.carId * 1;
  var car = data.cars.find(c => c.id === carId);

  res.status(200).json({ carId });
};