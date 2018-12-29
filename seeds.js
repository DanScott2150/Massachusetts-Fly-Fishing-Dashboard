//Used to populate the database with dummy data for development & testing purposes

    var mongoose = require("mongoose");
    var River = require("./models/river");
     
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
       //First, remove all existing data
        River.remove({}, function(err){
            if(err){
                console.log(err);
            }
            
            //Then, create a new River for each seed item
            data.forEach(function(seed){
                River.create(seed, function(err, river){
                    if(err){
                        console.log(err);
                    }
                    
                });
            });
       }); //River.remove
    } //seedDB
     
    module.exports = seedDB;