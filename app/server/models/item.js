'use strict';

var Config = require("../config/config.js");
var Bookshelf = require('../config/bookshelf.js')(Config);
var Items = Bookshelf.Model.extend({
  tableName: 'items',
  hasTimestamps: true
});

module.exports = Bookshelf.model('Items', Items);