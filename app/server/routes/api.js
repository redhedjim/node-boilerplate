var routes = require('express').Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var app = require('express')();
app.set('superSecret', config.secret);

// var requireAuth = function(req, res, next) {
// 	if (!req.user) {
// 		res.end('Not authorized', 401);
// 	} else {
// 		next();
// 	}
// };
//==============================
// AuthToken generator
//==============================
//This route will give the user a token. This token must be sent with every api request
routes.route('/login').all(function(req, res, bodyParser) {
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

// ====================================
// Middleware to verify token
// ====================================
routes.use('/users',function(req, res, next){
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
    // res.json({message: "Email and Password required."});
  }
});


routes.route('/users').get(function(req,res){
    var User = require('../models/user');
    var messages = [];
    User.forge().fetchAll().then(function(model){
        if(model){
                messages.push("users has been found");
                res.status(200).send({
                    error: false,
                    message: messages,
                    data: model
                });
        }
        else{
            messages.push("No users exist.");
            res.status(404).json({
                error: true,
                message: messages,
                data:null
            });
        } 
    }).catch(function(err){
        messages.push("There was an error saving this record. Please try again");
        messages.push(err.message);
            res.status(400).json({
                error: true,
                message: messages,
                data:null
            });
    });
})
.post(function(req,res){
    var User = require('../models/user');
    var messages = [];
    User.forge({email: req.body.email}).fetch().then(function(model){
        if(model){
            messages.push("This email is already taken.  Try logging in.");
            res.status(400).json({
                error: true,
                message: messages,
                data:null
            });
        }
        else{
            User.forge().save({
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                admin: req.body.admin
            }).then(function(model){
                messages.push("User has been created successfully");
                res.status(201).send({
                    error: false,
                    message: messages,
                    data: model
                });
            });
        } 
    }).catch(function(err){
        messages.push("There was an error saving this record. Please try again");
        messages.push(err.message);
            res.status(400).json({
                error: true,
                message: messages,
                data:null
            });
    });

});

routes.route('/users/:id').get(function(req, res){
    var User = require('../models/user');
    var messages = [];
    User.forge({id: req.params.id}).fetch().then(function(model){
        if(model){
                messages.push("User has been found");
                res.status(200).send({
                    error: false,
                    message: messages,
                    data: model
                });
        }
        else{
            messages.push("The user id could not be found. Please check your input and try again.");
            res.status(404).json({
                error: true,
                message: messages,
                data:null
            });
        } 
    }).catch(function(err){
        messages.push("Bad request.");
        messages.push(err.message);
            res.status(400).json({
                error: true,
                message: messages,
                data:null
            });
    });
})
.put(function(req,res){
    updateUser(req,res);
})
.patch(function(req,res){
    updateUser(req,res);
})
.delete(function(req,res){
    var User = require('../models/user');
    var messages = [];
    User.forge({id: req.params.id}).save({inactive: 1}, {patch:true}).then(function(model){
        if(model){
                messages.push("User has been deleted successfully");
                res.status(200).send({
                    error: false,
                    message: messages,
                    data: model
                });
        }
        else{
            messages.push("The user id could not be found. Please check your input and try again.");
            res.status(404).json({
                error: true,
                message: messages,
                data:null
            });
        } 
    }).catch(function(err){
        messages.push("Bad request.");
        messages.push(err.message);
            res.status(400).json({
                error: true,
                message: messages,
                data:null
            });
    });
});
module.exports = routes;

function updateUser(req,res){
    var User = require('../models/user');
    var messages = [];
    User.forge({id: req.params.id}).save({
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                admin: req.body.admin,
                password_digest: req.body.password_digest
        }, {patch:true}).then(function(model){
        if(model){
                messages.push("User has been edited successfully");
                res.status(200).send({
                    error: false,
                    message: messages,
                    data: model
                });
        }
        else{
            messages.push("The user id could not be found. Please check your input and try again.");
            res.status(404).json({
                error: true,
                message: messages,
                data:null
            });
        } 
    }).catch(function(err){
        messages.push("Bad request.");
        messages.push(err.message);
            res.status(400).json({
                error: true,
                message: messages,
                data:null
            });
    })
}
