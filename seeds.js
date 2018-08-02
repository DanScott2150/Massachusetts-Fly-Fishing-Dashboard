//Used to populate the database with dummy data for development & testing purposes

    var mongoose = require("mongoose");
    var River = require("./models/river");
    var Section = require("./models/section");
    var Comment = require("./models/comment");
    
    var swiftSections = ["Y Pool", "Cady Lane"];
    var millersSections = ["Erving", "Wendell Depot"];
     
    var data = [
        {
            name: "Swift River",
            location: "Belchertown, MA",
            lat: 42.2770,
            lng: -72.4009,
            description: "Quabbin tailwater. Y Pool, Rt.9 Bridge, Cady Lane, etc.",
            sections: [
                {
                    name: "Y-Pool"
                },
                {
                    name: "Cady-Lane"
                }
            ]
        },
        {
            name: "Millers River",
            location: "Athol, MA",
            lat: 42.5959,
            lng: -72.2267,
            description: "Erving, Wendell Depot, Bearsden, etc.",
            sections: [
                {
                    name: "Wendell Depot"
                },
                {
                    name: "Bearsden"
                }
            ]
        },
         {
            name: "Wassataquoik Stream",
            location: "Millinocket, ME",
            lat: 45.6573,
            lng: -68.7098,
            description: "Baxter State Park",
            sections: [
                {
                    name: "Lean-to"
                },
                {
                    name: "Grand Falls"
                }
            ]
        },
        {
            name: "Yaak",
            location: "Yaak, MT",
            lat: 48.8330,
            lng: -115.7087,
            description: "Montana",
            sections: [
                {
                    name: "Section 1"
                },
                {
                    name: "Section 2"
                }
            ]
        }
    ];
     
    function seedDB(){
       //First, remove all existing data
       River.remove({}, function(err){
            if(err){console.log(err);}
            
            Section.remove({}, function(err) {
                if(err){console.log(err);}
                
                Comment.remove({}, function(err){
                    if(err){console.log(err);}
            

        //Second, loop thru data array and add to database
            data.forEach(function(seed){
                River.create(seed, function(err, river){
                    if(err){console.log(err);}
                    else{
                        Comment.create({
                            text:"Test entry", author:"John Smith"
                        }, function(err, comment){
                            if(err){console.log(err);}
                            river.comments.push(comment);
                            river.save();
                        }
                        
                        );
                    }
                    
                    });
                });
                }); //Comment.remove
            }); //Section.remove
       }); //River.remove
    } //seedDB
     
    module.exports = seedDB;
    
    