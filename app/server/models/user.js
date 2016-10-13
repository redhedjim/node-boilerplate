'use strict';

var Config = require("../config/config.js");
var Bookshelf = require('../config/bookshelf.js')(Config);
var Users = Bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true
});

module.exports = Bookshelf.model('Users', Users);