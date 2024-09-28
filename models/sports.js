const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sportSchema = mongoose.Schema({
  name: String,
  url: String,
});

const Sport = mongoose.model("sports", sportSchema);

module.exports = Sport;
