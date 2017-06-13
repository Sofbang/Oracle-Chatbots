"use strict"

var request = require('request');
var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "WeatherQuery",
        "properties": {
            "location": { "type": "string", "required": true }
        },
        "supportedActions": [
            "success",
            "fail"
        ]
    }),

    invoke: (sdk, done) => {
        const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?q='
        const key = '&appid=416d0a7f43f6e2d8053904ac4cbc889e';

        var url = baseUrl + sdk.variable(sdk.properties().location) + key;

        logger.info('Calling out to=' + url);
        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                if (body.hasOwnProperty('weather')) {
                    sdk.reply({ text: body.weather[0].description });
                }
                else {
                    sdk.reply(body);
                }
                sdk.exit(true);
            }
            else {
                logger.info(error);
            }
            done(sdk);
        });
    }
};
