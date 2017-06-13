"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
var Constants = require('./constants');

var scheduleSelector = function(serviceType){
  var response = "";
  if(serviceType == 'bus'){
    response = "http://bustime.mta.info/";
  }else if(serviceType == 'subway'){
    response = "http://apps.mta.info/traintime/";
  }
  return response;
};

module.exports = {

    metadata: () => ({
        "name": "metropolis.TransitSchedule",
        "properties": {
          "serviceType": { "type": "string", "required": true }
        },
        "supportedActions": []
    }),

    invoke: (sdk, done) => {
      var serviceType = sdk.properties().serviceType;

      if(sdk.channelType() == 'facebook'){
        var fbPayload = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "button",
                "text": "You can find current " + serviceType + " schedule here:",
                "buttons": [
                  {
                    "type":"web_url",
                    "url": scheduleSelector(serviceType),
                    "title": serviceType.charAt(0).toUpperCase() + serviceType.slice(1) + " Transit"
                  }
                 ]
              }
            }
          };
        sdk.reply(fbPayload);
      }else{
        sdk.reply("You can find current " + serviceType + " schedule here: " + scheduleSelector(serviceType));
      };
      sdk.done(true);
      done(sdk);
    }
};
