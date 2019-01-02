//Create database schema for 'River' objects

var mongoose = require('mongoose');

//Schema setup
var riverSchema = new mongoose.Schema({
    name: String,
    location: String,
    lat: Number,
    lng: Number,
    usgsID: String,   //Even though this is a numeric ID, need to save it as a string since USGS site ID's frequently begin with a 0. Mongoose can't handle Number types for values that begin with 0
    journals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Journal"
        }
    ]
});

module.exports = mongoose.model("River", riverSchema);