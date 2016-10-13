<<<<<<< HEAD
'use strict';
/* globals require: true */

var Config = require("../config/config.js");
var Bookshelf = require('../config/bookshelf.js')(Config);
var Users = Bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true
});

module.exports = Bookshelf.model('Users', Users);

=======
'use strict';

var Config = require("../config/config.js");
var Bookshelf = require('../config/bookshelf.js')(Config);
var Users = Bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true
});

module.exports = Bookshelf.model('Users', Users);
>>>>>>> eb5523af01abfa590196ea68430e46263fc8005d
