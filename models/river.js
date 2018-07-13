var mongoose = require('mongoose');


//Schema setup

var sectionSchema = new mongoose.Schema({
    name: String,
});

var riverSchema = new mongoose.Schema({
    name: String,
    sections: [sectionSchema],
    location: String,
    description: String,
    
    // lat: Number,
    // lng: Number,
});

module.exports = mongoose.model("River", riverSchema);