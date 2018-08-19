// var fetch = require("node-fetch");       //Using axios instead, can uninstall and remove from package.json?
    require('dotenv').config();
var express     = require('express'),
    app         = express();
var axios = require("axios");
var River = require("../models/river");
var middlewareObj = {};

// import {GoogleCharts} from 'google-charts';
// 

middlewareObj.troutStocking = function(req, res, next){
//          google.charts.load('current', {'packages':['controls', 'table']});
//      GoogleCharts.setOnLoadallback(drawTable);
	  
// 	function drawTable() {
// 	    console.log("trout lookup");
// 		var queryString = encodeURIComponent(`SELECT A, B, C, E, G WHERE B="Swift River"`);
// 		var fishquery = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1yedDqFS59PIHnOYWYy8tNnLEbHBWVQ_GZxtGOuRkDzQ/gviz/tq?gid=0&headers=1&tq=' + queryString);
		
// 		fishquery.send(handleQueryResponse);
// 	} 
 
    // function handleQueryResponse(response) {
    //     if (response.isError()) {
    //         alert('Error in query: ' + response.getMessage());response.getDetailedMessage();
    //         return;
    //     }


  next();

};


middlewareObj.findWeather = function(req, res, next){
/* Makes API call to DarkSky to pull weather data */
    var currentLat;
    var currentLng;
    var darkSkyKey = process.env.DARKSKYAPIKEY;
    
    //Find current river
    var findLatLng = () => 
        //Find current river and return the lat & lng values
        River.findById(req.params.id, 'lat lng', function(err, foundRiver){
        if(err){console.log(err);}
        else {
            //Since this requires a call to the database, need to use Promises to deal with async issues
            return new Promise((resolve, reject) => {
                if(foundRiver){
                    // console.log("In Promise: " + foundRiver.lat);
                    resolve(foundRiver);
                }
            });
        }
    });
    
    findLatLng().then((response) => {
        currentLat = response.lat;
        currentLng = response.lng;
        
        //Construct API call url
        var weatherURL = `https://api.darksky.net/forecast/${darkSkyKey}/${currentLat},${currentLng}`;
        // console.log(`Coordinates for API call: ${currentLat}, ${currentLng}`);
        return axios.get(weatherURL);
    }).then((response) => {
        var fullData = response.data;
            res.locals.weatherData = fullData;
        next();
    });

};



middlewareObj.usgsData = function(req, res, next){
/* Makes API call to USGS */
    var currentID;
    
    //Find current river
    var findCurrentID = () => 
        //Find current river and return the usgs ID values
        River.findById(req.params.id, 'usgsID', function(err, foundRiver){
        if(err){console.log(err);}
        else {
            //Since this requires a call to the database, need to use Promises to deal with async issues
            return new Promise((resolve, reject) => {
                if(foundRiver){
                    // console.log("In Promise: " + foundRiver);
                    resolve(foundRiver);
                }
            });
        }
    });
    
    findCurrentID().then((response) => {
        currentID = response.usgsID;
        // console.log(currentID);
        //Construct API call url
        //No API key required for USGS data
        var usgsURL = `http://waterservices.usgs.gov/nwis/iv/?format=json&site=${currentID}&parameterCd=00060,00065`;
        return axios.get(usgsURL);
    }).then((response) => {
        var fullData = response.data;
            res.locals.usgsData = fullData;
        // console.log(fullData.value.timeSeries[0].variable.variableName);
        // console.log(fullData.value.timeSeries[0].values[0].value[0].value);
        next();
    });

};

module.exports = middlewareObj;

