//Middleware Index

//Pull in env variables that hold API keys    
require('dotenv').config();

var axios = require("axios");
var River = require("../models/river");
var middlewareObj = {};

var darkSkyKey = process.env.DARKSKYAPIKEY;
var dashboardObj = {};


middlewareObj.dashboardWeather2 = async function(req, res, next){
// 1), lookup all Rivers
    const rivers = await River.find({}, function(err, rivers){
                return new Promise((resolve, reject) => {
                    if(rivers){resolve(rivers);}
                });
        });
        
// 2) Build out the dashboard object which gets passed thru to view template
    await rivers.forEach(async function(river){
        let riverName = river.name;
        dashboardObj[riverName] = null;
        // await getWeather(river);
        
        let riverLat = river.lat;
        let riverLng = river.lng;
        let exclude = 'currently,minutely,hourly,alerts,flags'; //avoid unnecessary data from API response
        let weatherAPI = `https://api.darksky.net/forecast/${darkSkyKey}/${riverLat},${riverLng}?exclude=${exclude}`;
    
        let weatherData = await axios.get(weatherAPI);
        let temp = weatherData.data.daily.data[0].temperatureMax;
        
        dashboardObj[riverName] = temp;
        
    });
    

    // console.log("Dashboard 2: " + dashboardObj);
    res.locals.weatherDashboard = dashboardObj;
    next();
    
};


async function getWeather(river){
    console.log("getWeather(): " + river.name);
    
    let riverLat = river.lat;
    let riverLng = river.lng;
    let exclude = 'currently,minutely,hourly,alerts,flags'; //avoid unnecessary data from API response
    let weatherAPI = `https://api.darksky.net/forecast/${darkSkyKey}/${riverLat},${riverLng}?exclude=${exclude}`;

    let weather = await axios.get(weatherAPI)
                    .then((response) => {
                        let currentRiver = river.name;
                        // console.log(currentRiver + response.data.daily.data[0].temperatureMax);
                        dashboardObj[currentRiver] = response.data.daily.data[0].temperatureMax;
                        console.log(dashboardObj);
                        // console.log(response.data.daily.data[0]);
                    });
                    
                    return weather;
    
}


middlewareObj.dashboardWeather = function(req, res, next){
    console.log("Dashboard Weather middleware");

    
    
    var lookupRivers = () => 
        River.find({}, function(err, rivers){
            if(err){
                console.log(err);
            } else {
                return new Promise((resolve, reject) => {
                    if(rivers){
                        resolve(rivers);
                    }
                });
            }
        });
    

    lookupRivers().then((response) => {
        response.forEach(function(river){
            console.log("forEach loop: " + river.name);
            getWeather(river);
            // getWeather(river).then((data) => {
            //     console.log(data);
            // });
        });
        console.log("Dash Obj: " + dashboardObj);
        res.locals.weatherDashboard = dashboardObj;
    });
       /*     
        rivers.forEach(function(river){
            console.log(river.name);
            let riverLat = river.lat;
            let riverLng = river.lng;
            let exclude = 'currently,minutely,hourly,alerts,flags'; //avoid unnecessary data from API response
            let weatherAPI = `https://api.darksky.net/forecast/${darkSkyKey}/${riverLat},${riverLng}?exclude=${exclude}`;
    
            axios.get(weatherAPI)
            .then((response) => {
                dashboardObj[river.name] = response.data.daily.data[0].temperatureMax;
                // console.log(response.data.daily.data[0]);
            })
            .then((response) => {
                console.log(dashboardObj);
                res.locals.weatherDashboard = dashboardObj;
            });
            // console.log(dashboardObj);
        });
    }); */
    next();
};

middlewareObj.populateweather = function(req, res, next){
    River.find({}, function(err, rivers){
        if(err){
            console.log(err);
        }
        rivers.forEach(function(river){
            // console.log(river);
            weatherAPI(river);
        });
    });
    

    next();
};




function weatherAPI(river){
  
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