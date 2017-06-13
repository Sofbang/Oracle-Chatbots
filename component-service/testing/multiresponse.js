"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "MultipleResponses",
        "properties": {
            "numResponses": { "type": "integer", "required": true }
        },
        "supportedActions": [
        ]
    }),

    invoke: (sdk, done) => {
        const numResponses = sdk.properties().numResponses || 10;
        for (let i=1 ; i <= numResponses ; ++i) {
            sdk.reply('' + i);
        }
        done(sdk);
    }
};
