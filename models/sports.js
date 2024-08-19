const mongoose = require("mongoose");

const sportSchema = mongoose.Schema({
  name: String,
});

const Sport = mongoose.model("sports", sportSchema);

module.exports = Sport;
