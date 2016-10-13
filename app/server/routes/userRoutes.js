'use strict';

var routes = require('express').Router();
var crypto = require('crypto');	
var Config = require('../config/config');

//Encrypt user password function
function encrypt(password){
	var cipher = crypto.createCipher(Config.algorithm, password);
	var crypted = cipher.update(password, 'utf8', 'hex');
	cipher += cipher.final('hex');
	return crypted;
}

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
            //Stringify the user passsword because...reasons (encrypt function needs this to work properly)
	        var password = req.body.password.toString();
            User.forge().save({
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                admin: req.body.admin,
                password_digest: encrypt(password)
            }).then(function(model){
                messages.push("User has been created successfully");
                res.status(201).send({
                    error: false,
                    message: messages,
                    data: {
                        "email": model.attributes.email,
                        "first": model.attributes.first,
                        "last": model.attributes.last
                    }
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
    });
}