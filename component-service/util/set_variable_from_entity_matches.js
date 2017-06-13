"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "SetVariableFromEntityMatches",
        "properties": {
            "variable": { "type": "string", "required": true },
            "nlpVariable": { "type": "string", "required": true },
            "entity": { "type": "string", "required": true }
        },
        "supportedActions": [
        ]
    }),

    invoke: (sdk, done) => {
        var variable = sdk.properties().variable;
        var nlpVariable = sdk.properties().nlpVariable;
        var entity = sdk.properties().entity;

        logger.info('SetVariableFromEntityMatches: variable=' + variable + ' nlpVariable=' + nlpVariable + ' entity=' + entity);

        if (!variable || !nlpVariable || !entity) {
            throw new Error('SetVariableFromEntityMatches: Missing required property!');
        }

        var nlpResult = sdk.nlpResult(nlpVariable);
        var matches = nlpResult.entityMatches(entity);
        if (matches.length > 0) {
            logger.info('SetVariableFromEntityMatches: setting entity value=' + JSON.stringify(matches[0]));
            // TODO: check type safety!  Variable may not be of compatible type with matches..
            sdk.variable(variable, matches[0])
        }

        done(sdk);
    }
};
