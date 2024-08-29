const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  token: String,
  profilUrl: String,
  name: String,
  birthdate: String,
  gender: String,
  description: String,
  activities: [String],
  sports: [String],
  city: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
