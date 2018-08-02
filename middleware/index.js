// var fetch = require("node-fetch");       //Using axios instead, can uninstall and remove from package.json?
var express     = require('express'),
    app         = express();
var axios = require("axios");
var River = require("../models/river");

var middlewareObj = {};

middlewareObj.findWeather = function(req, res, next){
/* Makes API call to DarkSky to pull weather data */

var currentLat;
var currentLng;
var darkSkyKey = "8ae9a024254e2edf00f42c2dc694a34c";

//Find current river
var findLatLng = () => River.findById(req.params.id, 'lat lng', function(err, foundRiver){
    if(err){console.log(err);}
    else {
        return new Promise((resolve, reject) => {
            if(foundRiver){
                // console.log("In Promise: " + foundRiver.lat);
                resolve(foundRiver);
            }
        });
        // console.log(foundRiver.lat);
    }
});

findLatLng().then((response) => {
    currentLat = response.lat;
    currentLng = response.lng;
    var weatherURL = `https://api.darksky.net/forecast/${darkSkyKey}/${currentLat},${currentLng}`;
    // console.log(`Coordinates for API call: ${currentLat}, ${currentLng}`);
    return axios.get(weatherURL);
}).then((response) => {
    var temperature = response.data.currently.temperature;
    var summary = response.data.currently.summary;
    // res.locals.currentTemp = temperature;
    res.locals.weatherData = {
        currentTemp: temperature,
        currentSummary: summary
    };
    res.locals.currentTemp = temperature;
    // app.use(function(req, res, next){
    //     res.locals.currentTemp = temperature;
        
    // });
    // console.log(res.data);
    console.log(`The current temperature is: ${temperature}`);
    next();
});


//Find lat & long of current river
//For now, print to screen


// next();


};

module.exports = middlewareObj;

