require('dotenv').config(); //API keys for DarkSky and Google Sheets(Sheets API not currently used)
var express     = require('express'),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require('body-parser');

//Schema Models
var River       = require("./models/river"),
    Journal       = require("./models/journal"),
    middleware  = require("./middleware");

//Routes
var indexRoutes     = require('./routes/index'),
    riverRoutes     = require('./routes/rivers'),
    journalRoutes   = require('./routes/journals');

//App initialization
mongoose.connect("mongodb://localhost:27017/fishapp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
var methodOverride = require("method-override");    //To support HTTP 'put' & 'delete' methods  
app.use(methodOverride("_method"));

//Seed database with dummy data for development purposes. Deletes all existing and then repopulates
// var seedDB = require("./seeds");
// seedDB();

/////////////////
//Journal Routes
////////////////

/* TODO: Split out into 'routes' folder.
    Tried it and it threw errors. Moved back here for now */

//Create new journal entry for a river
app.get("/rivers/:id/journals/new", function(req, res){
    River.findById(req.params.id, function(err, currentRiver){
        if(err){console.log(err)} 
        else {
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
            //Create DB entry for new journal entry
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

//End of Journal Routes


//////////////////////
//Dashboard Route (main page of app)
////////////////////

//Middleware functions generate data (via API calls) for dashboard table
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


//Routes
//app.use("/", indexRoutes);                        //Currently empty.
//app.use("/rivers/:id/journals", journalRoutes);   //Currently empty
app.use("/rivers", riverRoutes);

//Launch server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Launched");
});