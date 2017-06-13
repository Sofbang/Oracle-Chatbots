"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
var Constants = require('./constants');

module.exports = {

    metadata: () => ({
        "name": "metropolis.askFBLocation",
        "properties": {},
        "supportedActions": []
    }),

    invoke: (sdk, done) => {

      console.log(JSON.stringify(sdk._request.body));
      if(sdk.channelType() == 'facebook'){
          sdk.reply({"text":"Please share your location:", "quick_replies":[
            {
              "content_type":"location",
              "payload": "myLocation"
            }
          ]});
      };
      sdk.done(true);
      done(sdk);


    }
};
