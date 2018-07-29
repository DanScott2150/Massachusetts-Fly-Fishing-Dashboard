
//App Init
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    // fetch       = require('node-fetch'),
    // findWeather       = require("./darksky.js"),            //Needed for DarkSky API calls
    Section     = require("./models/section"),
    River       = require("./models/river"), 
    middleware  = require("./middleware");
    
mongoose.connect("mongodb://localhost:27017/fishapp", { useNewUrlParser: true });
    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// findWeather();

//Method Override included to support HTTP put & delete methods  
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

//Seed database with dummy data. Deletes all existing and then repopulates
var seedDB = require("./seeds");
seedDB();


//INDEX route
//Main page, shows all rivers
app.get("/", function(req, res){
    River.find({}, function(err, allRivers){
        if(err){
            console.log(err);
        } else {
            res.render("rivers/index", {rivers: allRivers});
        }
    });
});

//NEW route
//Allows user to create new river
app.get("/rivers/new", function(req, res){
    res.render("rivers/new");
});

//CREATE route
app.post("/rivers", function(req, res){
    //Data pulled from form on NEW route: views/new.ejs
    var name = req.body.name;
    var location = req.body.location;
    var description = req.body.description;

    var newRiver = {name:name, location: location, description: description};
    River.create(newRiver, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//SHOW route
app.get("/rivers/:id", middleware.findWeather, function(req, res){
    //find river with the provided ID
    River.findById(req.params.id).exec(function(err, currentRiver){
        if(err){
            console.log(err);
        } else {
            res.render("rivers/show", {river: currentRiver, weather: req.currentTemp});
        }
    });
});

//EDIT route
app.get("/rivers/:id/edit", function(req, res){
    River.findById(req.params.id, function(err, currentRiver){
        if(err){
            console.log(err);
        } else{
            res.render("rivers/edit", {river: currentRiver});
        }
    });
});

//UPDATE route
app.put("/rivers/:id", function(req, res){
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
app.delete("/rivers/:id", function(req, res){
    River.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/");
        }
    });
});

/////// End of River Routes ////////

// Section Routes

app.get("/rivers/:id/sections/new", function(req, res){
   River.findById(req.params.id, function(err, currentRiver){
       if(err){
           console.log(err);
           res.redirect("back");
       } else {
           res.render("sections/new", {river: currentRiver});
       }
   }); 
});

app.post("/rivers/:id/sections", function(req, res){
    //Find river by ID
    River.findById(req.params.id, function(err, currentRiver){
        if(err){
            console.log(err);
            res.redirect("/rivers");
        } else { 
            //Create new section
            Section.create(req.body.section, function(err, section){
                if(err){
                    console.log(err);
                } else {
                    section.save();
                    currentRiver.sections.push(section);
                    currentRiver.save();
                    res.redirect("/rivers/" + currentRiver._id);
                }
            });
            
        }
    });
});



//Launch server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Launched");
});