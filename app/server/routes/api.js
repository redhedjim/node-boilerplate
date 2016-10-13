'use strict';

var routes = require('express').Router();
// <<<<<<< HEAD

// var models = require('./models');
// routes.use('/models', models);

// var cars = require('./cars');
// routes.use('/cars', cars);

// routes.route('/').get(function(req, res){
//     res.json({message: "get all Cars"});
// }).post(function(req, res){
//     var User = require('../models/user');
//     var messages = [];
//     User.forge({email: req.body.email}).fetch().then(function(model){
//         if(model){
//             messages.push('This email is already taken. Try logging in.');
//             res.status(400).json({
//                 error: true,
//                 message: messages,
//                 data:null
//             });
//         } else {
//             User.forge().save({
//                 first: req.body.first,
//                 last: req.body.last,
//                 admin: req.body.admin,
//                 email: req.body.email
//             }).then(function(model){
//                 messages.push('User has been created sucesfully.');
//                 res.status(200).send({
//                     error: false,
//                     message: messages,
//                     data: model
//                 });
//             });
//         }
//     }).catch(function(err){
//         messages.push('There was an error saving this record. Please try again.');
//         messages.push(err.message);
//         res.status(400).json({
//             error: true,
//             message: messages,
//             data:null
//         });
//     });
// });

// routes.route('/users/:id')

// .get(function(req,res){
//     res.json({message: "get single user"});

// })
// .put(function(req,res){
//     res.json({message: "edit single user"});

// })
// .delete(function(req,res){
//     res.json({message: "delete user"});

// =======
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
// >>>>>>> eb5523af01abfa590196ea68430e46263fc8005d
});

// app.use('/users', userRoutes);

module.exports = routes;
