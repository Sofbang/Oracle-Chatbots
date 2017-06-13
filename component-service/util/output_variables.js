"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "OutputVariables",
        "properties": {
            "variables": { "type": "string", "required": true }
        },
        "supportedActions": [
        ]
    }),

    invoke: (sdk, done) => {
        logger.info('OutputVariables: ' + sdk.properties().variables);

        var variables = sdk.properties().variables.split(',');
        variables.forEach( (variable) => {
            sdk.reply('' + variable + '=' + sdk.variable(variable));
        });

        // Sending replies and done afterwards
        sdk.exit(true).done(true);

        // TODO: support for continuing flow w/o input

        done(sdk);
    }
};
