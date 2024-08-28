var express = require("express");
var router = express.Router();
const Event = require("../models/events");

router.post("/add", (req, res) => {
  // ajouter vérif existence event identique + condition + else error

  console.log("REQ BODY:", req.body);
  const newEvent = new Event({
    name: req.body.name,
    type: req.body.type,
    event: req.body.event,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    date: req.body.date,
    city: req.body.city,
    address: req.body.address,
    slots: req.body.slots,
    expenses: req.body.expenses,
    femaleOnly: req.body.femaleOnly,
  });
  console.log("New added:", newEvent);

  newEvent.save().then(() => {
    res.json({ result: true, addedEvent: newEvent });
  });
});

router.get("/search", (req, res) => {
  const { activity, city, region, day, start, end } = req.query;

  const searchCriteria = {};
  if (activity) searchCriteria.activity = { $regex: activity, $options: "i" };
  if (city) searchCriteria.city = { $regex: city, $options: "i" };
  if (region) searchCriteria.region = { $regex: region, $options: "i" };
  if (day) searchCriteria.date = new Date(day);
  if (start) searchCriteria.startTime = { $gte: start };
  if (end) searchCriteria.endTime = { $lte: end };

  Event.find(searchCriteria).then((data) => {
    res.json({ result: true, events: data });
  });
});

// router.get('/search/:date', (req, res) => {
//   Event.findOne({date: req.params.date})
// })

module.exports = router;
