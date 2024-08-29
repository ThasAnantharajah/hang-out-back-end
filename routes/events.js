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
  // MAE WORKING ON
  // const {
  //   activityInput,
  //   cityInput,
  //   regionInput,
  //   dayInput,
  //   startInput,
  //   endInput,
  // } = req.query;

  // const searchCriteria = {};
  // if (activityInput)
  //   searchCriteria.activity = { $regex: activityInput, $options: "i" };
  // if (cityInput) searchCriteria.city = { $regex: cityInput, $options: "i" };
  // if (regionInput)
  //   searchCriteria.region = { $regex: regionInput, $options: "i" };

  // if (dayInput) {
  //   const date = new Date(dayInput);
  //   if (!isNaN(date.getTime())) {
  //     searchCriteria.date = date;
  //   }
  // }

  // if (startInput) searchCriteria.startTime = { $gte: startInput };
  // if (endInput) searchCriteria.endTime = { $lte: endInput };

  Event.find().then((data) => {
    res.json({ result: true, events: data });
  });
});

// router.get('/search/:date', (req, res) => {
//   Event.findOne({date: req.params.date})
// })

module.exports = router;
