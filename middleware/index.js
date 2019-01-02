// Middleware Functions
// Used to:
//  - Generate Weather data via API call
//  - Generate USGS river flow rates via API call

/*  *** TODO ***
    Right now, both Weather & USGS have two separate
    middleware functions each. There's one set of 
    functions to generate the API calls for a single River
    (used in the river/show route). There's another set
    of functions to generate the API calls to populate
    the Homepage Dashboard ('/' index). There's certainly
    a way to make the code a lot more DRY. Will have to
    bookmark to revisit later.
*/

require('dotenv').config();     //API keys held via environment variables

var axios = require("axios"),
    River = require("../models/river"),
    darkSkyKey = process.env.DARKSKYAPIKEY,
    dashboardObj = {},          //Holds weather data that gets passed to Dashboard route
    usgsObj = {},               //Holds USGS data that gets passed to Dashboard route
    middlewareObj = {};         //Object to hold middleware functions, gets exported via module.exports


//Generate USGS River flow data, gets passed to root dashboard
middlewareObj.dashboardUSGS = function(req, res, next){
    //Lookup all Rivers
    const rivers = River.find({}, function(err, rivers){
        if(err){console.log(err)}
        else {
            return new Promise((resolve, reject) => {
                if(rivers){resolve(rivers);}
            });
        }
    });

    //Once all Rivers are returned, loop through each and run getUSGS()
    rivers.then(
        async function(rivers){
            for (let river of rivers){
                //For each River, add a key/value pair to the usgsObj{}
                let riverName = river.name;
                usgsObj[riverName] = null;
                usgsObj[riverName] = await getUSGS(river);
            }
            
            //Once the for-of loop is complete for all Rivers, store the usgsObj{} in res.locals to pass it thru to the route
            res.locals.usgsDashboard = usgsObj;
            next();
    });
};

//Function for API call to USGS
async function getUSGS(river){
    let currentID = river.usgsID;   //Each River has a USGS ID# associated with it, stored in DB
    
    /*  USGS API does not require an API key
        Parameter Codes (parameterCd) of 00060 & 00065 represent flow rate(cfs) and water gage height.
        Reference: https://waterservices.usgs.gov/rest/IV-Service.html
    */
    
    var usgsURL = `http://waterservices.usgs.gov/nwis/iv/?format=json&site=${currentID}&parameterCd=00060,00065`;
    
    return axios.get(usgsURL)
        .then((response) => {
            let flowRate = response.data.value.timeSeries[0].values[0].value[0].value;
            return flowRate;
        });
}

//Generate weather data for root dashboard
middlewareObj.dashboardWeather2 = function(req, res, next){

    // 1) Find all Rivers
    const rivers = River.find({}, function(err, rivers){
        if(err){console.log(err)}
        else {
            return new Promise((resolve, reject) => {
                if(rivers){resolve(rivers);}
            });
        }
    });

    // 2) Loop thru each River, make API call for weather data
    rivers.then(async function(rivers){
        for (let river of rivers){
            let riverName = river.name;
            
            // 3) For each River, add a key/value pair to the dashboardObj{}
            dashboardObj[riverName] = null;
            dashboardObj[riverName] = await getWeather(river);
        }
        
        // 4) Store the dashboardObj{} in res.locals to pass it thru to the route
        res.locals.weatherDashboard = dashboardObj;
        next();
    });
};

//Function for API call to get weather for Dashboard
async function getWeather(river){
    
    // Populate latitude & longitude of River from DB
    let riverLat = river.lat,
        riverLng = river.lng,
        exclude = 'minutely,hourly,alerts,flags', //avoid unnecessary data from API response
        weatherAPI = `https://api.darksky.net/forecast/${darkSkyKey}/${riverLat},${riverLng}?exclude=${exclude}`;

    /*
        DarkSky.net API key stored as environment variable
        Docs: https://darksky.net/dev/docs
    */
    
    let weather = await axios.get(weatherAPI);
    let data = weather.data;
    return data;
}


// Generate weather data for single River (rivers/show route)
middlewareObj.findWeather = function(req, res, next){

    var currentLat,
        currentLng,
        darkSkyKey = process.env.DARKSKYAPIKEY;
    
    //Find current river, and populate lat/long
    var findLatLng = () => 
        River.findById(req.params.id, 'lat lng', function(err, foundRiver){
            if(err){console.log(err)}
            else {
                //Since this requires a call to the database, need to use Promises to deal with async issues
                return new Promise((resolve, reject) => {
                    if(foundRiver){
                        resolve(foundRiver);
                    }
                });
            }
        });

    //After finding River lat & long, make API call
    findLatLng().then((response) => {
        currentLat = response.lat;
        currentLng = response.lng;
        
        var weatherURL = `https://api.darksky.net/forecast/${darkSkyKey}/${currentLat},${currentLng}`;
        
        // console.log(`Coordinates for API call: ${currentLat}, ${currentLng}`);
        return axios.get(weatherURL);
    }).then((response) => {
        var fullData = response.data;
            res.locals.weatherData = fullData;
        next();
    });

};

//Generate USGS flow data for single River (rivers/show route)
middlewareObj.usgsData = function(req, res, next){
    var currentID;
    
    //Lookup current river, return the associated USGS ID number
    var findCurrentID = () => 
        River.findById(req.params.id, 'usgsID', function(err, foundRiver){
            if(err){console.log(err); next();}
            else {
                //Since this requires a call to the database, need to use Promises to deal with async issues
                return new Promise((resolve, reject) => {
                    if(foundRiver){
                        resolve(foundRiver);
                    }
                });
            }
        });

    //Make API call to USGS. No API key required
    findCurrentID().then((response) => {
        currentID = response.usgsID;
        var usgsURL = `http://waterservices.usgs.gov/nwis/iv/?format=json&site=${currentID}&parameterCd=00060,00065`;
        return axios.get(usgsURL);
    }).then((response) => {
        var fullData = response.data;
        res.locals.usgsData = fullData;
        next();
    });
};

module.exports = middlewareObj;