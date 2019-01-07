//Create database schema for custom map markers
// Each River has a map on its show route, user can add custom markers
//      to mark things like specific fishing spots, parking, nearby camping, and other notes

var mongoose = require("mongoose");

var mapMarkerSchema = new mongoose.Schema({
    lat: Number,
    lng: Number,
    type: String,
    title: String,
    text: String
});

module.exports = mongoose.model("MapMarker", mapMarkerSchema);