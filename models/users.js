const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
<<<<<<< HEAD
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
=======
    email:String,
    username:String,
    password:String,
    token:String,
    profilUrl: String,
    
    friends: [{
        userId: String,
        profile : String,
    }]
})
>>>>>>> 3ff77024648b00d4b409d61aa94c6c71f1f07a13

const User = mongoose.model("users", userSchema);

module.exports = User;
