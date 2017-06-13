"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "LocationBasedOptions",
        "properties": {
            "location": { "type": "string", "required": true },
            "variable": { "type": "string", "required": true }
        },
        "supportedActions": [
        ]
    }),

    invoke: (sdk, done) => {
        var AVAIL_OPTIONS = [
      		  'Toronto',
  		      'Sydney',
  		      'Paris',
  		      'Rome',
  		      'Tokyo'
  	      ];

        // Determine valid options
        var returnedOptions = null;
        if (sdk.properties().location === 'random') {
            returnedOptions = AVAIL_OPTIONS.slice(0, getRandomInt(1, AVAIL_OPTIONS.length));
        }
        else {
            returnedOptions = AVAIL_OPTIONS;
        }

        var text = sdk.text();
        var variableName = sdk.properties().variable;
        var variableValue = sdk.variable(variableName);

        if (variableValue == null || variableValue == undefined) {
            if (returnedOptions.includes(text)) {
                sdk.variable(variableName, text);
            }
            else {
                // TODO: Only supporting test UI for now, reply should be based on channel type!
                sdk.reply({
                    text: 'Your options are based on your location.'
                });
                sdk.reply({
                    text: 'The options you have are:',
                    choices: returnedOptions
                });
                sdk.exit(true);
            }
        }

        done(sdk);
    }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
