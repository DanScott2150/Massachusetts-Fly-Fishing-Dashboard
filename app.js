
//App Init

    require('dotenv').config();
var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    // fetch       = require('node-fetch'),
    // findWeather       = require("./darksky.js"),            //Needed for DarkSky API calls
    Section     = require("./models/section"),
    River       = require("./models/river"),
    Comment     = require("./models/comment"),
    middleware  = require("./middleware");

const axios = require('axios');

axios.get('https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/tilequery/-72.195,42.614.json?limit=5&access_token=pk.eyJ1IjoiZGFuc2NvdHQyMTUwIiwiYSI6ImNqa3d1dGRtMjAweTQzcW1tb2R1cmNsY3QifQ.J7IvUUi46-D3JkY6klKNDg')
.then((response) => {
    // console.log(response.data.features);
});
    
// var commentRoutes = require("./routes/comments");
// app.use("/rivers/:id/comments", commentRoutes);
    
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
    var lat = req.body.lat;
    var lng = req.body.lng;
    var location = req.body.location;
    var description = req.body.description;
    var usgs = req.body.usgs;

    var newRiver = {name:name, location:location, lat:lat, lng:lng, usgsID:usgs, description: description};
    River.create(newRiver, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});



//SHOW route
app.get("/rivers/:id", middleware.findWeather, middleware.usgsData, middleware.troutStocking, function(req, res){
    //find river with the provided ID
    River.findById(req.params.id).populate("comments").exec(function(err, currentRiver){
        if(err){
            console.log(err);
        } else {
            res.render("rivers/show", {river: currentRiver, weather: res.locals.weatherData, usgsData: res.locals.usgsData});
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


//COMMENT ROUTES

//NEW
app.get("/rivers/:id/comments/new", function(req, res){
    River.findById(req.params.id, function(err, foundRiver){
        if(err){console.log(err);}
        else{
            res.render("comments/new", {river: foundRiver});
        }
    });
});

//Comment Create
app.post("/rivers/:id/comments", function(req, res){
    //find river using ID
    River.findById(req.params.id, function(err, currentRiver){
        if(err){
            console.log(err);
            res.redirect("/rivers");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){console.log(err);}
                else {
                    //To-do, add username support
                    comment.save();
                    currentRiver.comments.push(comment);
                    currentRiver.save();
                    res.redirect("/rivers/" + currentRiver._id);
                }
            });
        }
        
    });
});

// const axios = require('axios');
// axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1yedDqFS59PIHnOYWYy8tNnLEbHBWVQ_GZxtGOuRkDzQ/values/All!A2:F15?key=${process.env.GOOGLESHEETSAPIKEY}`).then((response) => {
//     console.log(response.data.values[0]);
// });



// var GoogleSpreadsheet = require('google-spreadsheet');

// var doc = new GoogleSpreadsheet('1yedDqFS59PIHnOYWYy8tNnLEbHBWVQ_GZxtGOuRkDzQ');
// var sheet;

// (function getInfoAndWorksheets() {
//     doc.getInfo(function(err, info) {
//       console.log('Loaded doc: '+info.title+' by '+info.author.email);
//       sheet = info.worksheets[0];
//     //   console.log(sheet);
//     });

//   })();
  
//  var fs = require('fs'); 
// var readline = require('readline');
// var {google} = require('googleapis');

// var google = require('https://www.gstatic.com/charts/loader.js');
// var {google} = require('googleapis');

// var query = new google.visualization.Query(`https://docs.google.com/spreadsheets/d/1yedDqFS59PIHnOYWYy8tNnLEbHBWVQ_GZxtGOuRkDzQ/?key=${process.env.GOOGLESHEETSAPIKEY}`);
    
// query.setQuery('select dept, sum(salary) group by dept');
// query.send(handleQueryResponse);

// (function listRivers(){
//     const sheets = google.sheets({version: 'v4'});
//     sheets.spreadsheets.values.get({
//         spreadsheetId: '1yedDqFS59PIHnOYWYy8tNnLEbHBWVQ_GZxtGOuRkDzQ',
//         range: 'All!A2:F15'
//     }, (err, res) => {
//         if(err){return console.log(err);}
//         else {
//             const rows = res.data.values;
//             if(rows.length){
//                 console.log('A, B:');
//                 rows.map((row) => {
//                     console.log(`${row[0]}, ${row[4]}`);
//                 });
//             }
//         }
//     });
// })();

  
// (function getSpreadsheetRows(){
//     doc.getRows(1, {offset: 1, limit: 20}, function(err, data){
//         // var report = JSON.stringify(data);
//         console.log(data);
// // fs.writeFile('data.json', report);
//     });
// })();

// (function getWorksheets(){
//     doc.getInfo(function(err, info){
//         sheet = info.worksheets[0];
//     sheet.getCells({
//         'min-row': 1,
//         'max-row': 5,
//         'return-empty': true
//     }, function(err, cells){
//         console.log(cells);
//     });    
        
//     });
// })();



  
//Launch server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Has Launched");
});