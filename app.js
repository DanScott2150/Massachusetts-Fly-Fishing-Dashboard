require('dotenv').config(); //API keys for DarkSky and Google Sheets(Sheets API not currently used)
var express     = require('express'),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require('body-parser'),
    flash       = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

//Schema Models
var River       = require("./models/river"),
    Journal       = require("./models/journal"),
    MapMarker   = require('./models/mapmarker'),
    middleware  = require("./middleware");

//Routes
var indexRoutes     = require('./routes/index'),
    riverRoutes     = require('./routes/rivers'),
    journalRoutes   = require('./routes/journals');

//App initialization

// const mLabUser = process.env.MLABUSERNAME;
// const mLabPass = process.env.MLABPASSWORD;
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fishapp", { useNewUrlParser: true });
mongoose.connect(`mongodb://dan:EDir38m@ds243084.mlab.com:43084/heroku_cwsm6tgg`);


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
var methodOverride = require("method-override");    //To support HTTP 'put' & 'delete' methods  
app.use(methodOverride("_method"));

//Seed database with dummy data for development purposes. Deletes all existing and then repopulates
// var seedDB = require("./seeds");
// seedDB();

// Flash configuration
app.use(cookieParser('let the cowboys ride against the wind'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.post('/rivers/:id/mapMarkers/', function(req, res){
    River.findById(req.params.id, function(err, currentRiver){
        if(err){
            console.log(err);
        }
        else{
            MapMarker.create(req.body.markerData, function(err, marker){
                if(err){
                    console.log(err);
                } else {
                    currentRiver.mapMarkers.push(marker);
                    currentRiver.save();
                    res.redirect("/rivers/" + currentRiver._id + '#map');
                }
            });
        }
    });
});

// Delete Map Marker Route
    app.delete("/rivers/:id/mapMarkers/:mapmarker_id", function(req, res){
        MapMarker.findByIdAndRemove(req.params.mapmarker_id, function(err){
           if(err){
               console.log(err);
           } else {
               res.redirect("/rivers/" + req.params.id );
           }
   });
    });

app.get('/gmaps', function(req, res){
    res.render('gmapstest');
});

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
app.use("/", indexRoutes);                        //Currently empty.
app.use("/rivers/:id/journals", journalRoutes);   //Currently empty
app.use("/rivers", riverRoutes);

//Launch server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Launched");
});