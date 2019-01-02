//Not currently used. Ran into errors when trying to split journals routes here.
//Will figure it out later, for now the routes are in app.js

var express     = require("express"),
    router      = express.Router(),
    River       = require('../models/river'),
    Journal     = require('../models/journal');


// router.get("/new", function(req, res){
//     River.findById(req.params.id, function(err, currentRiver){
//         if(err){
//             console.log(err);
            
//         } else {
//             console.log(currentRiver);
//           res.render("journals/new", {river: currentRiver}); 
//         }
        
//     });
// });






module.exports = router;