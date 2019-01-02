var mongoose = require("mongoose");

var journalSchema = new mongoose.Schema({
    text: String,
    author: String,
    date: Date
});

module.exports = mongoose.model("Journal", journalSchema);