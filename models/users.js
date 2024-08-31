const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  token: String,
  profilePic: String,
  name: String,
  birthdate: String,
  gender: String,
  description: String,
  activities: [String],
  sports: [String],
  city: String,
  friends: [
    {
      userId: String,
      profile: String,
    },
  ],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
