var mongoose = require('mongoose');


//Schema setup

var sectionSchema = new mongoose.Schema({
    name: String,
});

var riverSchema = new mongoose.Schema({
    name: String,
    sections: [sectionSchema],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }],
    location: String,
    lat: Number,
    lng: Number,
    usgsID: String,   //Even though this is a numeric ID, need to save it as a string since USGS site ID's frequently begin with a 0. Mongoose can't handle Number types for values that begin with 0
    description: String,
    
    // lat: Number,
    // lng: Number,
});

module.exports = mongoose.model("River", riverSchema);