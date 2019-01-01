//Middleware Index

//Pull in env variables that hold API keys    
require('dotenv').config();

var axios = require("axios");
var River = require("../models/river");
var middlewareObj = {};

var darkSkyKey = process.env.DARKSKYAPIKEY;
var dashboardObj = {};
var usgsObj = {};

middlewareObj.dashboardUSGS = function(req, res, next){
    /* Makes API call to USGS */
    
    const rivers = River.find({}, function(err, rivers){
            return new Promise((resolve, reject) => {
                if(rivers){resolve(rivers);}
            });
         });
         
    rivers.then(async function(rivers){
        for (let river of rivers){
            let riverName = river.name;
            usgsObj[riverName] = null;
            usgsObj[riverName] = await getUSGS(river);
        }
           res.locals.usgsDashboard = usgsObj;
        //   console.log(usgsObj);
            next(); 
    });
    
};
         
async function getUSGS(river){
    let currentID = river.usgsID;
        
        var usgsURL = `http://waterservices.usgs.gov/nwis/iv/?format=json&site=${currentID}&parameterCd=00060,00065`;
        return axios.get(usgsURL)
            .then((response) => {
                let flowRate = response.data.value.timeSeries[0].values[0].value[0].value;
                return flowRate;
            });
}


middlewareObj.dashboardWeather2 = function(req, res, next){
  
  //step 1, find all rivers
  
  const rivers = River.find({}, function(err, rivers){
            return new Promise((resolve, reject) => {
                if(rivers){resolve(rivers);}
            });
         });
         
    rivers.then(async function(rivers){
        for (let river of rivers){
            let riverName = river.name;
            dashboardObj[riverName] = null;
            dashboardObj[riverName] = await getWeather(river);
            


        }
                    // console.log(dashboardObj);
                       res.locals.weatherDashboard = dashboardObj;
                        next(); 
    });
    
};


async function getWeather(river){
    // console.log("getWeather(): " + river.name);
    
    let riverLat = river.lat;
    let riverLng = river.lng;
    let exclude = 'minutely,hourly,alerts,flags'; //avoid unnecessary data from API response
    let weatherAPI = `https://api.darksky.net/forecast/${darkSkyKey}/${riverLat},${riverLng}?exclude=${exclude}`;

    // let currentRiver = river.name;
    let weather = await axios.get(weatherAPI);
    
    let data = weather.data;
    
    // let data = [
    //     weather.data.daily.data[0].temperatureMax, 
    //     weather.data.daily.data[1].temperatureMax,
    //     weather.data.daily.data[2].temperatureMax, 
    //     weather.data.daily.data[3].temperatureMax,
    //     weather.data.daily.data[4].temperatureMax, 
    //     weather.data.daily.data[5].temperatureMax,
    //     weather.data.daily.data[6].temperatureMax, 
    //     weather.data.daily.data[7].temperatureMax,
    //     // weather.data.daily.data[8].temperatureMax, 
    //     // weather.data.daily.data[9].temperatureMax
    //     ];
    
    return data;
    
    // dashboardObj[currentRiver] = weather.data.daily.data[0].temperatureMax;
    // return new Promise((resolve, reject) => {
    //     resolve(dashboardObj[currentRiver]);
    // });
    // console.log(dashboardObj);
/*                    .then((response) => {
                        let currentRiver = river.name;
                        // console.log(currentRiver + response.data.daily.data[0].temperatureMax);
                        dashboardObj[currentRiver] = response.data.daily.data[0].temperatureMax;
                        // console.log(dashboardObj);
                        // console.log(response.data.daily.data[0]);
                    });
                    
                    return weather;
  */  
}





middlewareObj.troutStocking = function(req, res, next){
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
        if(err){
            console.log(err);
        }
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
        if(err){console.log(err); next();}
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