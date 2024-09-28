const mongoose = require("mongoose");

const sportSchema = mongoose.Schema({
  name: String,
  url: String,
});

const Sport = mongoose.model("sports", sportSchema);

module.exports = Sport;
