var fetch = require("node-fetch");
var River = require("../models/river");

var middlewareObj = {};

middlewareObj.findWeather = function(req, res, next){
/* Makes API call to DarkSky to pull weather data */

var lat;

    //Find river we need   
   River.findById(req.params.id, function(err, foundRiver){
       if(err){
           res.redirect("back");
       } else {
            //access the latitude value of river
            // console.log(foundRiver.lat);
            lat = foundRiver.lat;

       }
    });

    
    var darksky = 'https://api.darksky.net/forecast/';
    var key = '8ae9a024254e2edf00f42c2dc694a34c';

    // var lat = 42.5959;
    var lng = -75.7584;
    var uri = darksky + key + '/' + lat +','+ lng;

    console.log("Lat: " + lat);
            next();
/*
    uri = uri.concat('?units=ca&exclude=minutely,hourly&lang=ru');
    
    var options = {
        method: 'GET',
        mode: 'cors'
    };


    var darkSkyReq = new fetch.Request(uri, options);

    fetch(darkSkyReq)
        .then((response)=>{
            if(response.ok){
                return response.json();
            }else{
                throw new Error('Bad HTTP!');
            }
        })
        .then( (j) =>{
            // console.log(j.currently.temperature, j.currently.summary);
            var currentTemp = j.currently.temperature;
            req.currentTemp = currentTemp;
            // console.log( j.daily.data[1] );
            next();
        })
        .catch( (err) =>{
            console.log('ERROR:', err.message);
        });
*/
};


module.exports = middlewareObj;



