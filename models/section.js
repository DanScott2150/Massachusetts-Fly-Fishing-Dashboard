var mongoose = require('mongoose');


//Schema setup
var sectionSchema = new mongoose.Schema({
    name: String,
});

module.exports = mongoose.model("Section", sectionSchema);