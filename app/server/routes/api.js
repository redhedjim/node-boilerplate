
var routes = require('express').Router();
routes.get('/', function(req, res){
    var creds = req.headers.creds;
        if(creds){
            res.json({ message: 'Hooray!!! Welcome to the API file' });
        }else{
            res.json({ message: "UNAUTHORIZED"});
        }
});

module.exports = routes;