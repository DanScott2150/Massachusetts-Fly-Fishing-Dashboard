require('dotenv').config(); //API keys for DarkSky and Google Sheets(not currently used)
    
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    River       = require("./models/river"),
    Journal       = require("./models/journal"),
    middleware  = require("./middleware");

//Routes
var indexRoutes     = require('./routes/index'),
    riverRoutes     = require('./routes/rivers'),
    journalRoutes   = require('./routes/journals');

mongoose.connect("mongodb://localhost:27017/fishapp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
var methodOverride = require("method-override");    //Method Override to support HTTP 'put' & 'delete' methods  
app.use(methodOverride("_method"));

//Seed database with dummy data for development purposes. Deletes all existing and then repopulates
var seedDB = require("./seeds");
seedDB();

app.get("/rivers/:id/journals/new", function(req, res){
    River.findById(req.params.id, function(err, currentRiver){
        if(err){
            console.log(err);
            
        } else {
            console.log(currentRiver);
           res.render("journals/new", {river: currentRiver}); 
        }
        
    });
});

app.post("/rivers/:id/journals/", function(req, res){
    River.findById(req.params.id, function(err, currentRiver){
        if(err){
            console.log(err);
            res.redirect("/rivers");
        } else {
            console.log(req.body.journal);
            Journal.create(req.body.journal, function(err, journal){
                if(err){
                    console.log(err);
                } else {
                    currentRiver.journals.push(journal);
                    currentRiver.save();
                    res.redirect("/rivers/" + currentRiver._id + '#outings');
                }
            });
        }
});
});

//Home Page Route - Dashboard
app.get("/", middleware.dashboardWeather2, middleware.dashboardUSGS, function(req, res){
    River.find({}, function(err, allRivers){
        if(err){console.log(err)}
        else {
            res.render("rivers/index", 
            {
                rivers: allRivers, 
                weatherDashboard: res.locals.weatherDashboard, 
                flowRate: res.locals.usgsDashboard
            });
        }
    });
});


    




// app.use(function(req, res, next){
//     res.locals.currentUser = req.user;
//     next();
// });




//Routes
app.use("/", indexRoutes);
app.use("/rivers/:id/journals", journalRoutes);
app.use("/rivers", riverRoutes);



  
//Launch server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Launched");
});