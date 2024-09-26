const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  token: String,
  profilePic: String,
  name: String,
  birthdate:{Date: Date},
  gender: String,
  description: String,
  activities: [{ name: String }],
  sports: [{ name: String }],
  city: String,
  friends: [{id: {type: Schema.Types.ObjectId, ref: 'users'}}],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
