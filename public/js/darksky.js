// console.log("Connected to DarkSky File");

// var fetch = require("node-fetch");

var weather = $("#weather");
// weather.html("<p>Hello World</p>");

function findWeather(){

//set up variables for API call
var darksky = 'https://api.darksky.net/forecast/';
var key = '8ae9a024254e2edf00f42c2dc694a34c';
var lat = 45.3483;
var lng = -75.7584;
var uri = darksky + key + '/' + lat +','+ lng;
console.log(uri);

uri = uri.concat('?units=ca&exclude=minutely,hourly&lang=ru');
var options = {
    method: 'GET',
    mode: 'cors'
};

var req = new fetch.Request(uri, options);

fetch(req)
    .then((response)=>{
        if(response.ok){
            return response.json();
        }else{
            throw new Error('Bad HTTP!');
        }
    })
    .then( (j) =>{
        weather.html("<p>Weather is: </p>");

        console.log(j.currently.temperature, j.currently.summary);
        
        // console.log( j.daily.data[1] );
        //console.log('JSON data provided');
    })
    .catch( (err) =>{
        console.log('ERROR:', err.message);
    });
    
}

// module.exports = findWeather;
