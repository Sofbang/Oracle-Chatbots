"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();


// JSON file structure:
// {
//    <variablename>: <value>,
//    <variablename>: <value>
//    ...
// }

module.exports = {

    metadata: () => ({
        "name": "SetVariablesFromFile",
        "properties": {
            "filename": { "type": "string", "required": true }
        },
        "supportedActions": [
        ]
    }),

    invoke: (sdk, done) => {
        logger.info('SetVariablesFromFile: using filename=' + sdk.properties().filename);

        var fileContents = require('./' + sdk.properties().filename);
        for (var variable in fileContents) {
            var value = fileContents[variable];
            sdk.variable(variable, value);
            logger.info('SetVariablesFromFile: set var ' + variable + '=' + value);
        }

        done(sdk);
    }
};
