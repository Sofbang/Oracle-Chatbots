"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
var Constants = require('./constants');

module.exports = {

    metadata: () => ({
        "name": "metropolis.getFBLocation",
        "properties": {},
        "supportedActions": []
    }),

    invoke: (sdk, done) => {

      if(sdk.channelType() == 'facebook'){
        console.log(sdk._request.body);
      };

      sdk.done(true);
      done(sdk);

    }
};
