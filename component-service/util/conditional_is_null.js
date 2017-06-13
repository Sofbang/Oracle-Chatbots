"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "ConditionalIsNull",
        "properties": {
            "variable": { "type": "string", "required": true }
        },
        "supportedActions": [
            "isnull",
            "isnotnull"
        ]
    }),

    invoke: (sdk, done) => {
        logger.info('ConditionalIsNull: ' + sdk.properties().variable);

        var value = sdk.variable(sdk.properties().variable);
        logger.info('ConditionalIsNull: checking value=' + value);
        if (value != null)
            sdk.action("isnotnull");
        else
            sdk.action("isnull");

        done(sdk);
    }
};
