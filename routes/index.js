var express = require("express");
var router = express.Router();

// upload requirements
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const Sport = require("../models/sports");
const Review = require("../models/reviews");
const Activity = require("../models/activities");
const Event = require("../models/events");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//            UPLOAD ROUTES

router.post("/upload", async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);

    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }

  fs.unlinkSync(photoPath);
});

//            PERSONNAL API  ROUTES

router.get("/sports", (req, res) => {
  Sport.find().then((data) => {
    res.json({ result: true, sports: data });
  });
});

router.get("/reviews", (req, res) => {
  Review.find().then((data) => {
    res.json({ result: true, reviews: data });
  });
});

router.get("/activities", (req, res) => {
  Activity.find().then((data) => {
    res.json({ result: true, activities: data });
  });
});

// EVENTS ROUTES

router.post("/events", (req, res) => {
  // ajouter vérif existence event identique + condition + else error
  const newEvent = new Event({
    name: req.body.name,
    type: req.body.type,
    event: req.body.event,
    city: req.body.city,
    address: req.body.address,
    slots: req.body.slots,
    expenses: req.body.expenses,
    femaleOnly: req.body.femaleOnly,
  });
  console.log(newEvent);

  newEvent.save().then(() => {
    res.json({ result: true, addedEvent: newEvent });
  });
});

router.get("/events", (req, res) => {
  Event.find().then((data) => {
    res.json({ result: true, events: data });
  });
});

module.exports = router;
