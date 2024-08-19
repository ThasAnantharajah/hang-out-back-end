const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
  name: String,
});

const Activity = mongoose.model("activities", activitySchema);

module.exports = Activity;
