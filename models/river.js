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
    description: String,
    
    // lat: Number,
    // lng: Number,
});

module.exports = mongoose.model("River", riverSchema);