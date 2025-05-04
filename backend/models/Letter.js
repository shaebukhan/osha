const mongoose = require("mongoose");

const letterSchema = new mongoose.Schema({
  title: String,
  date: String,
  url: String,
  content: String,
});

module.exports = mongoose.model("Letter", letterSchema);
