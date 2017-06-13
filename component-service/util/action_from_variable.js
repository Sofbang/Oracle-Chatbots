"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "ActionFromVariable",
        "properties": {
            "variable": { "type": "string", "required": true }
        },
        "supportedActions": [
        ]
    }),

    invoke: (sdk, done) => {
        logger.info('ActionFromVariable: var=' + sdk.properties().variable);
        var value = sdk.variable(sdk.properties().variable);
        logger.info('ActionFromVariable: setting action=' + value);
        sdk.action(value);
        done(sdk);
    }
};
