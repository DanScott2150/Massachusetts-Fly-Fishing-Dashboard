//Create database schema for Journal entries.
// Basically comments that can be posted on a given River's page

var mongoose = require("mongoose");

var journalSchema = new mongoose.Schema({
    text: String,
    author: String,
    date: Date
});

module.exports = mongoose.model("Journal", journalSchema);