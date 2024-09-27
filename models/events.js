const mongoose = require("mongoose");

const placeSchema = mongoose.Schema({
  city: String,
  address: String,
  coords: {
    lat: Number,
    long: Number,
  },
});

const eventSchema = mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: String,
  desc: String,
  type: String,
  event: String,
  startTime: String,
  endTime: String,
  date: Date,
  place: placeSchema,
  slots: Number,
  expenses: Boolean,
  femaleOnly: Boolean,
  participants: [String],
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
