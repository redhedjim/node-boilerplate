'use strict';

var routes = require('express').Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var app = require('express')();
app.set('superSecret', config.secret);


//==============================
// AuthToken generator
//==============================
//This route will give the user a token. This token must be sent with every api request
routes.route('/login').post(function(req, res, bodyParser) {
  var User = require('../models/user.js');
  var crypto = require('crypto');

  User.forge({email: req.body.email}).fetch().then(function(user, err) {

    //Takes the routes password entry, encrypts it and checks against database
    var userPassword = req.body.password_digest;
    if(userPassword !== undefined && userPassword !== null && userPassword !== ""){

      //encrypts password and compares to DB entry
      // var hashPassword = crypto
      //   .createHash("md5")
      //   .update(userPassword)
      //   .digest('hex');
      var hashPassword = userPassword;
      /** Enable this version of hashPassword instead of above until signup feature is made.
          
          var hashPassword = userPassword;
        
      **/
      if (!user) {
        //Condition check to see if user exists
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        // check if password matches
        if (user.get('password_digest') != hashPassword) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          // if user is found and password is right
          // create a token
          var authToken = jwt.sign(user, app.get('superSecret'), {
            expiresIn: config.tokenValidTime // expires in 24 hours
          });
          
        //   var verifiedJWT = jwt.verify(authToken, app.get('superSecret'));
          // res.send({message: verifiedJWT.attributes.admin})
          // return the information including token as JSON
        //   var userFirstName = verifiedJWT.attributes.first;
        //   var userLastName = verifiedJWT.attributes.last;
          res.json({
            success: true,
            message: 'Enjoy your token!',
            authToken: authToken,
            // admin: verifiedJWT.attributes.admin,
            // user: verifiedJWT.attributes.id,
            // userFirstName: userFirstName,
            // userLastName: userLastName
          });
        }
        }

    }else{
      res.json({message: "Password required."});
    }


  }).catch(function(err) {
      
        // if (err) throw err;
        res.json({message: "Email and Password required."});
  });
});

module.exports = routes;