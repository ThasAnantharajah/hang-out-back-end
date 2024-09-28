const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  token: String,
  profilePic: String,
  name: String,
  birthdate: Date,
  gender: String,
  description: String,
  favoriteActivities: [String],
  favoriteSports: [{ type: Schema.Types.ObjectId, ref: "sports" }],
  city: String,
  friends: [{ id: { type: Schema.Types.ObjectId, ref: "users" } }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
