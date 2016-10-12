'use strict';

module.exports = function(app, express, bodyParser, Bookshelf, _, knex) {
    /*Instantiate new router*/
    var apiRouter = express.Router();
    /*Test route to make sure everything is working*/
    apiRouter.get('/', function (req, res) {
        console.log("API works");
        var creds = req.headers.creds;
        if(creds){
            res.json({ message: 'Hooray!!! Welcome to the API file' });
        }else{
            res.json({ message: "UNAUTHORIZED"});
        }

    });
    return apiRouter;
};