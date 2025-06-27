const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  ip: String,
  city: String,
  region: String,
  isp: String,
  latitude: Number,
  longitude: Number,
  time: String,
  userId: String,
  assessmentId: String
});

module.exports = mongoose.model("Location", locationSchema);
