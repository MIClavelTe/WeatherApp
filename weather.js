var EventEmitter = require("events").EventEmitter;
var api = require('./api.json');
var https = require("https");
var http = require("http");
var util = require("util");

/**
 * An EventEmitter to get a place's coordinates.
 * @param coordinates
 * @constructor
 */
function Forecast(coordinates) {

    EventEmitter.call(this);

    profileEmitter = this;

    //Connect to the API URL (https://api.darksky.net/forecast/key/coordinates)
    var request = https.get(`https://api.darksky.net/forecast/${api.key}/${coordinates}`, function(response) {
        var body = "";

        if (response.statusCode !== 200) {
            request.abort();
            //Status Code Error
            profileEmitter.emit("error", new Error("There was an error getting the forecast for " + coordinates + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
        }

        //Read the data
        response.on('data', function (chunk) {
            body += chunk;
            profileEmitter.emit("data", chunk);
        });

        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    //Parse the data
                    var profile = JSON.parse(body);
                    profileEmitter.emit("end", profile);
                } catch (error) {
                    profileEmitter.emit("error", error);
                }
            }
        }).on("error", function(error){
            profileEmitter.emit("error", error);
        });
    });
}

util.inherits( Forecast, EventEmitter );

module.exports = Forecast;