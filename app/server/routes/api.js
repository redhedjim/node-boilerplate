'use strict';

var routes = require('express').Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var app = require('express')();
app.set('superSecret', config.secret);

// var unprotectedRoutes = require('./loginRoutes');
// var userRoutes = require('./userRoutes');

// app.use('/login',unprotectedRoutes);

// ====================================
// Middleware to verify token
// ====================================
routes.use(function(req, res, next){
  //Checks the header, url params, or POST params for token
  var authToken = /*req.body.authToken || req.query.authToken ||*/ req.headers['x-auth-token'];
console.log("middleware");
  //decode token if found
  if (authToken) {

//verifies secret and checks token expirary
    jwt.verify(authToken, app.get('superSecret'), function(err, decoded) {
      
      if(err) {
        return res.json({
          error: true,
          message: "Failed to authenticate token."      
        });
      } else {
          
        req.decoded = decoded;
        next();
      }  
    });
  } else {
    res.redirect('/login');
  }
});

// app.use('/users', userRoutes);

module.exports = routes;
