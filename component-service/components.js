"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var log4js = require('log4js');
var logger = log4js.getLogger();

var shell = require('./shell');

var createComponentsServer = function(urlPath) {
    var app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    var router = express.Router();
    router.use(morgan('combined'));

    // Return component metadata
    router.route('/').get(function (req, res) {
        res.set('Content-Type', 'application/json')
           .status(200)
           .json(shell.getAllComponentMetadata());
    });

    // Invoke component by name
    router.route('/:componentName').post(function (req, res) {
        const componentName = req.params.componentName;
        shell.invokeComponentByName(req.params.componentName, req.body, {}, function(err, data) {
            if (!err) {
                res.status(200).json(data);
            }
            else {
                switch (err.name) {
                    case 'unknownComponent':
                        res.status(404).send(err.message);
                        break;
                    case 'badRequest':
                        res.status(400).json(err.details);
                        break;
                    default:
                        res.status(500).json(err.details);
                        break;
                }
            }
        });
    });

    app.use(urlPath, router);

    logger.info('Express server: component server created at context path=' + urlPath);

    return app;
};

module.exports = createComponentsServer;
