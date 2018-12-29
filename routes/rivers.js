var express     = require("express"),
    router      = express.Router(),
    River       = require("../models/river"),
    middleware  = require("../middleware");

//NEW route -- for user to create new river
router.get("/new", function(req, res){
    res.render("rivers/new");
});

//CREATE route
router.post("/", function(req, res){
    //Data pulled from form on NEW route: views/new.ejs
    var name = req.body.name;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var location = req.body.location;
    var description = req.body.description;
    var usgs = req.body.usgs;

    var newRiver = {
        name:name, 
        location:location, 
        lat:lat, 
        lng:lng, 
        usgsID:usgs, 
        description: description
    };
    
    River.create(newRiver, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});


//SHOW route
router.get("/:id", middleware.findWeather, middleware.usgsData, middleware.troutStocking, function(req, res){
    //find river with the provided ID
    River.findById(req.params.id).exec(function(err, currentRiver){
        if(err){
            console.log(err);
        } else {
            res.render("rivers/show", {river: currentRiver, weather: res.locals.weatherData, usgsData: res.locals.usgsData});
        }
    });
});

//EDIT route
router.get("/:id/edit", function(req, res){
    River.findById(req.params.id, function(err, currentRiver){
        if(err){
            console.log(err);
        } else{
            res.render("rivers/edit", {river: currentRiver});
        }
    });
});

//UPDATE route
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

//DESTROY route
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