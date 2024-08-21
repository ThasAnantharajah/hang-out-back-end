var express = require("express");
var router = express.Router();
const Event = require("../models/events");

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
