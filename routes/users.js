var express = require("express");
var router = express.Router();
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

// handles sign up
router.post("/signup", (req, res) => {
  const array = ["email", "username", "password"];

  if (!checkBody(req.body, array)) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
     
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: hash,
        token: uid2(32),
      });
      newUser.save().then(() => {
        res.json({
          result: true,
          token: newUser.token,
          username: newUser.username,
          email: newUser.email,
        });
      });
    } else {
      res.json({ result: false, error: "User already exists" });
    }
  });
});

// handles login
router.post("/login", (req, res) => {
  const array = ["username", "password"];

  if (!checkBody(req.body, array)) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ username: req.body.username })
  .populate({
    path:'friends.id',
    select:'name birthdate profilePic _id'
  })
  .then((data) => {
    // console.log(JSON.stringify(data, null, 2))
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
     
      res.json({     
        result: true,
        token: data.token,
        username: data.username,
        email: data.email,
        userId: data._id,
        name: data.name,
        friends: data.friends, 
        profilePic: data.profilePic
      });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });

});

// retrieve user
router.get("/search", (req, res) => {
  User.find().then((data) => {
    res.json({ result: true, usersList: data });
  });
});

router.get("/friends/:username", (req, res) => {
  User.findOne().then((data) => {
    res.json({ result: true, users: data });
  });
});

// profile update route
router.put("/update/:username", (req, res) => {
  const { username } = req.params;
  const {
    name,
    birthdate,
    gender,
    description,
    activities,
    sports,
    city,
    profilePic,
  } = req.body;

  console.log("Request to update user:", { username, userUpdate: req.body });

  User.findOne({ username }).then((existingUser) => {
    if (!existingUser) {
      return res.json({ result: false, message: "User was not found" });
    } else {
      User.updateOne(
        { username },
        {
          ...(name && { name }),
          ...(birthdate && { birthdate }),
          ...(gender && { gender }),
          ...(description && { description }),
          ...(activities && { activities }),
          ...(sports && { sports }),
          ...(city && { city }),
          ...(profilePic && { profilePic }),
        }
      ).then((result) => {
        if (result.modifiedCount > 0) {
          User.findOne({ username }).then((updatedUser) => {
            res.json({
              result: true,
              message: "User updated successfully.",
              data: updatedUser,
            });
          });
        } else {
          return res.json({
            result: false,
            message: "No changes were made to the user.",
          });
        }
      });
    }
  });
});







module.exports = router;
