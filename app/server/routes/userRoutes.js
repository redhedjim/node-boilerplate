'use strict';



//get an instance of the express router
var users = require('express').Router();
var requireAuth = function(req, res, next) {
  if (!req.user) {
    res.end('Not authorized', 401)
  } else {
    next()
  }
}

//test route to make sure everything is working
//accessed at GET http://localhost:3000/api
// users.get('/', function(req, res){
//    res.redirect('/#login');
//    res.json({ message: 'Hooray!!! Welcome to the TbTrak API' });

// });
users.use('/users', function(req, res, next){
   res.redirect('/#login');
   res.json({ message: 'Hooray!!! Welcome to the TbTrak API' });
   next();
});

//==============================
// AuthToken generator
//==============================
//This route will give the user a token. This token must be sent with every api request
users.post('/login', function(req, res, bodyParser) {
  var User = require('../models/user.js');
  var crypto = require('crypto');

  User.forge({email: req.body.email}).fetch().then(function(user, err) {

    //Takes the users password entry, encrypts it and checks against database
    var userPassword = req.body.password;
    if(userPassword !== undefined && userPassword !== null && userPassword !== ""){

      //encrypts password and compares to DB entry
      // var hashPassword = crypto
      //   .createHash("md5")
      //   .update(userPassword)
      //   .digest('hex');
      var hashPassword = userPassword
      /** Enable this version of hashPassword instead of above until signup feature is made.
          
          var hashPassword = userPassword;
        
      **/
      if (!user) {
        //Condition check to see if user exists
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        // check if password matches
        if (user.get('password') != hashPassword) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          // if user is found and password is right
          // create a token
          var authToken = jwt.sign(user, app.get('superSecret'), {
            expiresIn: '7d' // expires in 24 hours
          });
          
          var verifiedJWT = jwt.verify(authToken, app.get('superSecret'));
          // res.send({message: verifiedJWT.attributes.admin})
          // return the information including token as JSON
          var userFirstName = verifiedJWT.attributes.first;
          var userLastName = verifiedJWT.attributes.last;
          res.json({
            success: true,
            message: 'Enjoy your token!',
            authToken: authToken,
            admin: verifiedJWT.attributes.admin,
            user: verifiedJWT.attributes.id,
            userFirstName: userFirstName,
            userLastName: userLastName
          });
        }
        }

    }else{
      res.json({message: "Password required."})
    }


  }).catch(function(err) {
        if (err) throw err;

  })
});

// ====================================
// Middleware to verify token
// ====================================
users.use(function(req, res, next){
  //Checks the header, url params, or POST params for token
  var authToken = /*req.body.authToken || req.query.authToken ||*/ req.headers['x-auth-token'];

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
        var Setting = require('../models/setting.js');
        Setting.forge({id:1}).fetch().then(function(results){
          if(results === null){
            Setting.forge().save({id:1});
          }else{
            app.set('settings', results.attributes); //Place setting inside app
          }
        }).then(function(){
          req.decoded = decoded; //If token checks out, save to request for use in other users
          next();
        }).catch(function(err){
          console.log("Couldn't get settings");
        })      
      }  
    });
  } else {
    res.redirect('/#login');S
  }
});

module.exports = users;