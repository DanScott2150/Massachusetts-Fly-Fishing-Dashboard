
//App Init
    require('dotenv').config();
    
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    // fetch       = require('node-fetch'),
    // findWeather       = require("./darksky.js"),            //Needed for DarkSky API calls
    River       = require("./models/river"),
    middleware  = require("./middleware");




mongoose.connect("mongodb://localhost:27017/fishapp", { useNewUrlParser: true });
    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


//Method Override included to support HTTP put & delete methods  
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

//Seed database with dummy data. Deletes all existing and then repopulates
var seedDB = require("./seeds");
seedDB();


//INDEX route
//Main page, shows all rivers
app.get("/", middleware.dashboardWeather2, function(req, res){
    River.find({}, function(err, allRivers){
        if(err){console.log(err)}
        else {
            // console.log("From routes:" + res.locals.weatherDashboard);
            res.render("rivers/index", {rivers: allRivers, weatherDashboard: res.locals.weatherDashboard});
        }
    });
});

var riverRoutes = require("./routes/rivers");
app.use("/rivers", riverRoutes);
  
//Launch server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Launched");
});