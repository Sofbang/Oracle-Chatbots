"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();
var Constants = require('./constants');

module.exports = {

    metadata: () => ({
        "name": "metropolis.FlightArrival",
        "properties": {
            "foo": { "type": "string", "required": false }
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

      var queryObject = {};
      queryObject.auth_key = Constants.SAN_JOSE_AUTH_KEY;

      var request = require('request');
      var url = Constants.SAN_JOSE_FLUGHT_APIS_URL;

      request.get({url: url, qs: queryObject},
        function(err, httpResponse, body) {
          if (err) {
            logger.info('get failed:', err);
          }
          logger.info('Get successful!  Server responded with:', body);
          var flights = [];
          var counter = 1;
          var recCounter = 1;
          var dataResult = JSON.parse(body);
          console.info("Result " + JSON.stringify(dataResult));
          console.info("Result Array " + JSON.stringify(dataResult.result.fArray));
          var flightArray = dataResult.result.fArray;
          console.info("Flights List " + JSON.stringify(flightArray));

          var flightDetail = {};
          flightArray.forEach(function (flightData){
            if(recCounter == 1){
              flightDetail.flightNumber = flightData.fStr;
            }
            if(recCounter == 3){
              flightDetail.arrivalTime = flightData.fStr;
            }
            if(recCounter == 4){
              flightDetail.status = flightData.fStr;
            }

            if(recCounter == 6){
              flights.push(flightDetail);
              flightDetail = {};
              recCounter = 0;
            }
            recCounter++;
          });
          console.info("Fligts - " + JSON.stringify(flights));

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
              sdk.reply(dataResult.title);
            };

            var rangeSize = 4;

            var array = flights.slice(rangeStart, flights.length);
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
              fbcard.title = "Flight " + item.flightNumber;
              fbcard.subtitle = "Time: " + item.arrivalTime + " - " + item.status;
              fbPayload.attachment.payload.elements.push(fbcard);
            });
            // Add Next button
            if(hasNext){
              fbPayload.attachment.payload.buttons = [
                {
                  "type": "postback",
                  "title": "Next",
                  "payload": "next"
                }
              ];
            };
            fbPayload.quick_replies = [
              {
                "content_type":"text",
                "title":"Done",
                "payload":"done"
              }];
            sdk.reply(fbPayload);

          }else{
            flights.forEach(function(item){
              sdk.reply({ "text": "Flight: " + item.flightNumber + ", Time - " + item.arrivalTime + " - " + item.status});
            });
            //sdk.reply({ "text":"Proceed", "choices": ["bus", "subway" ], "type": "choice"});
            sdk.action('complete');
          };
          sdk.done(true);
          done(sdk);

        });
    }
};
