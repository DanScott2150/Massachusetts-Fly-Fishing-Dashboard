//Used to populate the database with dummy data for development & testing purposes

var mongoose = require("mongoose");
var River = require("./models/river");
//var Journal = require("./models/journal");
var MapMarker = require('./models/mapmarker');

//Define data
var data = [
    {
        name: "Swift River",
        location: "Belchertown, MA",
        lat: 42.271486,
        lng: -72.3422424,
        usgsID: "01175500",
    },
    {
        name: "Millers River",
        location: "Athol, MA",
        lat: 42.5959,
        lng: -72.2267,
        usgsID: "01166500",
    },
    {
        name: "Westfield River",
        location: "Chesterfield, MA",
        lat: 42.3918,
        lng: -72.8398,
        usgsID: "01183500",
    }
];

function seedDB(){
    //Remove all existing data:
    River.remove({}, function(err){
        if(err){console.log(err)}
        console.log("Existing Rivers wiped");
        
    //Create a new 'River' for each object in seed data[] array
        data.forEach(function(seed){
            River.create(seed, function(err, river){
                if(err){console.log(err)} 
                else {
                    console.log("River created via seedDB()");
    //                                             MapMarker.create(
    //                             {
    //                                     lat: 42.5959,
    // lng: -72.2267,
    // type: "Camping",
    // title: "Bearsden Lean-to",
    // description: "10-minute hike to Bearsden",
    // icon: "parking"
    //                             }, function(err, marker){
    //                                 if(err){
    //                                     console.log(err);
    //                                 } else {
    //                                     river.mapMarkers.push(marker);
    //                                     river.save();
    //                                     console.log("Created new map marker");
    //                                 }
    //                             });
                }
            });
        });
    });
} 

module.exports = seedDB;