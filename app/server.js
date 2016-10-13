'use strict';
/* globals require: true */

/*Import express*/
var express = require('express');
/*Import config file*/
var config = require('./server/config/config');
/*Set current path for use in server file*/
var path = require('path');
/*Import body-parser to parse incoming HTML/Header requests*/
var bodyParser = require('body-parser');
/*Import knex to manage schema creation and easier mysql queries*/
var knex = require('knex');
/*Import bookshelf to be our DB ORM and do all the DB heavy lifting*/
var Bookshelf = require('./server/config/bookshelf')(config);
/*Import underscore as dependency of bookshelf and to help make basic function calling easier*/
var _ = require("underscore");

/*Declare router*/
var app = require('express')();

/*Expose public directoy*/
// app.use(express.static(__dirname + '/public'));
/*Get info from HTML forms via bodyParser*/
app.use(bodyParser.json()); 
/*Allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience */
app.use(bodyParser.urlencoded({ extended: true }));
/*Middleware to set headers to every client response*/
app.use(function(req,res,next) {   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');

    /*Intercept OPTIONS method*/
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});


/*Import API file & send all requests to API file*/
var apiRoutes = require('./server/routes/api');
var loginRoutes = require('./server/routes/loginRoutes');
var userRoutes = require('./server/routes/userRoutes');

app.use('/', loginRoutes);
app.use('/users', apiRoutes);
app.use('/', userRoutes);

/*START SERVER & Listen on port defined in config file and send console message when connected*/
app.listen(config.port, function(){
     console.log("Running on localhost:3000. Welcome!");
});

app.set('superSecret', config.secret); //Secret variable