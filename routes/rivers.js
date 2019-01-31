// RIVERS routes

var express     = require("express"),
    router      = express.Router(),
    River       = require("../models/river"),
    middleware  = require("../middleware");

// RIVER NEW ROUTE
    router.get("/new", function(req, res){
        // res.send("New River route");
        res.render("rivers/new");
    });
    
// RIVER CREATE ROUTE
    router.post("/", function(req, res){
        var newRiver = {};
        
        if(req.body.name){
            newRiver.name = req.body.name;
        } else {
            req.flash('error', "River Name Required");
            return res.redirect('back');
        }
        
        if(req.body.lat && req.body.lng){
            newRiver.lat = req.body.lat;
            newRiver.lng = req.body.lng;
        } else {
            req.flash('error', "Latitude & Longitude Required");
            return res.redirect('back');
        }
        
        if(req.body.usgs){
            newRiver.usgsID = req.body.usgs;
        } else {
            newRiver.usgsID = null;
        }
        
        newRiver.location = req.body.location;
        console.log(newRiver);

        // var newRiver = {
        //         name:name, 
        //         location:location, 
        //         lat:lat, 
        //         lng:lng, 
        //         usgsID:usgs
        //     };

        River.create(newRiver, function(err, newlyCreated){
            if(err){console.log(err)} 
            else {
                res.redirect("/");
            }
        });
    });

// RIVER SHOW ROUTE
// Individual river page. Gets weather forecast & USGS data via middleware
    router.get("/:id", middleware.findWeather, middleware.usgsData, function(req, res){
    //Lookup River, and populate any Journal Entries associated with it:
        River.findById(req.params.id)
            .populate("journals")
            .populate("mapMarkers")
            .exec(function(err, currentRiver){
                if(err){
                    console.log(err);
                } else {
                    res.render("rivers/show", {
                        river: currentRiver, 
                        weather: res.locals.weatherData, 
                        usgsData: res.locals.usgsData
                    });
                }
            });
    });

// RIVER EDIT ROUTE
    router.get("/:id/edit", function(req, res){
        River.findById(req.params.id, function(err, currentRiver){
            if(err){console.log(err)}
            else{
                res.render("rivers/edit", {river: currentRiver});
            }
        });
    });

// RIVER UPDATE ROUTE
    router.put("/:id", function(req, res){
        River.findByIdAndUpdate(req.params.id, req.body.river, function(err, river){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                res.redirect("/rivers/" + river._id);    
            }
        });
    });

// RIVER DESTROY ROUTE
    router.delete("/:id", function(req, res){
        River.findByIdAndRemove(req.params.id, function(err){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                res.redirect("/");
            }
        });
    });





module.exports = router;