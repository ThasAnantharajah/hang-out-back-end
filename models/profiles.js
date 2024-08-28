const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  userId: String,
  photoUrl: String,
  name: String,
  dateOfBirth: Date,
  gender: String,
  hobbies: [
    {
      name: String,
    },
  ],
  sports: [
    {
      name: String,
    },
  ],
});

const Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;
