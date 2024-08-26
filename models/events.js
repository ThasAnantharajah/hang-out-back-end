const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  //   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: String,
  type: String,
  event: String,
  startTime: String,
  endTime: String,
  date: Date,
  city: String,
  address: String,
  slots: Number,
  expenses: Boolean,
  femaleOnly: Boolean,
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
