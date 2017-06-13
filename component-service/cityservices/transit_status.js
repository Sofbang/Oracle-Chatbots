"use strict"

var parseString = require('xml2js').parseString;

var log4js = require('log4js');
var logger = log4js.getLogger();
var Constants = require('./constants');

module.exports = {

    metadata: () => ({
        "name": "metropolis.TransitStatus",
        "properties": {
            "serviceType": { "type": "string", "required": true }
        },
        "supportedActions": [
            "hasNext",
            "complete"
        ]
    }),

    invoke: (sdk, done) => {

      logger.info("Recieved - " + sdk.text());
      if(sdk.text() == 'done'){
        sdk.variable("rangeStart", 0);
        sdk.action('complete');
        sdk.done(true);
        done(sdk);
        return;
      }

      var response = null;

      var request = require('request');
      var url = Constants.MTA_SERVICE_URL;

      request.get({url: url},
        function(err, httpResponse, body) {
          if (err) {
            logger.info('get failed:', err);
          }
          logger.debug('Get successful!  Server responded with:', body);
          var xml = body;
          var jsonPayload = {};
          parseString(xml, {explicitArray: false}, function (err, jsonresult) {
              jsonPayload = jsonresult;
              console.log(JSON.stringify(jsonresult));
              console.log(err);
          });
          var statusDetails = [];

          jsonPayload.service[sdk.properties().serviceType].line.forEach(function (item){
            statusDetails.push({"name": item.name, "status": item.status});
          });

          console.info("Status - " + JSON.stringify(statusDetails));

          if (sdk.channelType() === 'facebook') {
            var fbPayload = {
                "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "list",
                    "top_element_style": "compact",
                    "elements": []
                  }
                }
              };

            var rangeStart = parseInt(sdk.variable("rangeStart"));
            console.info("Range start - " + rangeStart);

            if(rangeStart == 0){
              sdk.reply("Here is the current service status of NYC " + sdk.properties().serviceType + " service:");
            };

            var rangeSize = 4;

            var array = statusDetails.slice(rangeStart, statusDetails.length);
            var hasNext = false;

            if (array.length > rangeSize) {
              array = array.slice(0, rangeSize);
              sdk.variable("rangeStart", rangeStart+rangeSize);
              hasNext = true;
              sdk.action('hasNext');
            } else {
              sdk.variable("rangeStart", 0);
              hasNext = false;
              sdk.action('complete');
            }

            array.forEach(function(item){
              var fbcard = {};
              fbcard.title = "Line " + item.name;
              fbcard.subtitle = "Status: " + item.status;
              fbPayload.attachment.payload.elements.push(fbcard);
            });

            // Add Next button
            if(hasNext){
              fbPayload.attachment.payload.buttons = [{
                  "type": "postback",
                  "title": "Next",
                  "payload": "next"
              }];
            };
            fbPayload.quick_replies = [
              {
                "content_type":"text",
                "title":"Done",
                "payload":"done"
              }];
            sdk.reply(fbPayload);
            // sdk.reply({"text":"Please share your location:", "quick_replies":[
            //   {
            //     "content_type":"location",
            //   }
            // ]});
          }else{
            statusDetails.forEach(function(item){
              sdk.reply({ "text": "Line: " + item.name + " - " + item.status});
            });
            //sdk.reply({ "text":"Proceed", "choices": ["bus", "subway" ], "type": "choice"});
            sdk.action('complete');
          }
          sdk.done(true);
          done(sdk);

        });
    }
};
