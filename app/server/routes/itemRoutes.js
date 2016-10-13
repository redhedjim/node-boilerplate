module.exports = function(routes){

    routes.route('/items').get(function(req,res){
        var Item = require('../models/item');
        var messages = [];
        Item.forge().fetchAll().then(function(model){
            if(model){
            console.log('getting all items');
                    messages.push("items has been found");
                    res.status(200).send({
                        error: false,
                        message: messages,
                        data: model
                    });
            }
            else{
                messages.push("No items exist.");
                res.status(404).json({
                    error: true,
                    message: messages,
                    data:null
                });
            } 
        }).catch(function(err){
            messages.push("There was an error retrieving. Please try again");
            messages.push(err.message);
                res.status(400).json({
                    error: true,
                    message: messages,
                    data:null
                });
        });
    })
    .post(function(req,res){
        var Item = require('../models/item');
        var messages = [];
        Item.forge({name: req.body.name}).fetch().then(function(model){
            if(model){
                messages.push("This item already exists.");
                res.status(400).json({
                    error: true,
                    message: messages,
                    data:null
                });
            }
            else{
                Item.forge().save({
                    name: req.body.name,
                    rfid: req.body.rfid,
                    description: req.body.description
                }).then(function(model){
                    messages.push("Item has been created successfully");
                    res.status(201).send({
                        error: false,
                        message: messages,
                        data: model
                    });
                });
            } 
        }).catch(function(err){
            messages.push("There was an error saving this item. Please try again");
            messages.push(err.message);
                res.status(400).json({
                    error: true,
                    message: messages,
                    data:null
                });
        });

    });

    routes.route('/items/:id').get(function(req, res){
        var Item = require('../models/item');
        var messages = [];
        Item.forge({id: req.params.id}).fetch().then(function(model){
            if(model){
                    messages.push("Item has been found");
                    res.status(200).send({
                        error: false,
                        message: messages,
                        data: model
                    });
            }
            else{
                messages.push("The item id could not be found. Please check your input and try again.");
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
        var Item = require('../models/item');
        var messages = [];
        Item.forge({id: req.params.id}).delete().then(function(model){
            if(model){
                    messages.push("Item has been deleted successfully");
                    res.status(200).send({
                        error: false,
                        message: messages,
                        data: model
                    });
            }
            else{
                messages.push("The item id could not be found. Please check your input and try again.");
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
    return routes;
};

function updateItem(req,res){
        var Item = require('../models/item');
        var messages = [];
        Item.forge({id: req.params.id}).save({
                    name: req.body.name,
                    rfid: req.body.rfid,
                    description: req.body.description
            }, {patch:true}).then(function(model){
            if(model){
                    messages.push("Item has been edited successfully");
                    res.status(200).send({
                        error: false,
                        message: messages,
                        data: model
                    });
            }
            else{
                messages.push("The item id could not be found. Please check your input and try again.");
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