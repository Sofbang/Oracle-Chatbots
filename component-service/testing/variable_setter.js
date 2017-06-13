"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "VariableSetter",
        "properties": {
            "name": { "type": "string", "required": true },
            "value": { "type": "string", "required": true}
        },
        "supportedActions": [
        ]
    }),

    invoke: (sdk, done) => {
        const name = sdk.properties().name;
        const value = sdk.properties().value;

        logger.info('VariableSetter: setting ' + name + '=' + value);
        sdk.variable(name, value).done(true).exit(true);

        done(sdk);
    }
};
