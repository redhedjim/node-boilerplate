'use strict';
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var Config = require('../config/config');
var crypto = require('crypto');

var routes = require('express').Router();
var app = require('express')();
app.set('superSecret', Config.secret);

//Encrypt user password function
function encrypt(password) {
  var cipher = crypto.createCipher(Config.algorithm, password);
  var crypted = cipher.update(password, 'utf8', 'hex');
  cipher += cipher.final('hex');
  return crypted;
}

//==============================
// AuthToken generator
//==============================
//This route will give the user a token. This token must be sent with every api request
routes.route('/login').post(function (req, res, bodyParser) {
  var User = require('../models/user.js');
  User.forge({ email: req.body.email }).fetch().then(function (user, err) {
    //Takes the routes password entry, encrypts it and checks against database
    var password = req.body.password.toString();
    if (password) {
      var passwordDigest = encrypt(password);
      if (!user) {
        //Condition check to see if user exists
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        // check if password matches

        if (user.get('password_digest').toString() !== passwordDigest) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          // if user is found and password is right create a token
          var authToken = jwt.sign(user, app.get('superSecret'), {
            expiresIn: Config.tokenValidTime // expires in 24 hours
          });
          res.json({
            success: true,
            message: 'Enjoy your token!',
            authToken: authToken
          });
        }
      }

    } else {
      res.json({ message: "Password required." });
    }


  }).catch(function (err) {
    res.json({ message: "Email and Password required." });
  });
});

module.exports = routes;