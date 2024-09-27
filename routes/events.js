var express = require("express");
var router = express.Router();
const Event = require("../models/events");
const mongoose = require("mongoose");
const moment = require("moment");

router.post("/add", (req, res) => {
  // ajouter vérif existence event identique + condition + else error
  const {
    name,
    type,
    event,
    startTime,
    endTime,
    date,
    slots,
    expenses,
    femaleOnly,
    createdBy,
    place,
  } = req.body;

  console.log("REQ BODY:", req.body);
  // console.log(typeof new Date(req.body.date));
  // console.log(new Date(req.body.date) instanceof Date);
  const newEvent = new Event({
    name: req.body.name,
    type: req.body.type,
    event: req.body.event,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    date: new Date(req.body.date),
    place: req.body.place,
    slots: req.body.slots,
    expenses: req.body.expenses,
    femaleOnly: req.body.femaleOnly,
    createdBy: req.body.createdBy,
  });
  console.log("New added:", newEvent);

  newEvent.save().then(() => {
    res.json({ result: true, addedEvent: newEvent });
  });
});

// SEARCH EVENTS ON MULTIPLE CRITERIA
router.get("/search/", (req, res) => {
  // MAE WORKING ON
  const {
    activityInput,
    cityInput,
    regionInput,
    dayInput,
    startInput,
    endInput,
  } = req.query;

  const searchCriteria = {};
  if (activityInput)
    searchCriteria.name = { $regex: activityInput, $options: "i" };
  if (cityInput) searchCriteria.city = { $regex: cityInput, $options: "i" };
  if (regionInput)
    searchCriteria.region = { $regex: regionInput, $options: "i" };

  if (dayInput) {
    // const date = new Date(dayInput);
    // if (!isNaN(date.getTime())) {
    searchCriteria.date = date;
    // }
  }

  if (startInput) searchCriteria.startTime = { $gte: startInput };
  if (endInput) searchCriteria.endTime = { $lte: endInput };

  Event.find(searchCriteria)
    .populate("createdBy", "username")
    .then((data) => {
      res.json({ result: true, numberOfEvents: data.length, events: data });
    });
});

// SEARCH EVENT BASED ON DATE
router.get("/search/date/:date", (req, res) => {
  const { date } = req.params;
  console.log("date sent to BACK:", date);
  const parsedDate = moment(date, "YYYY-MM-DD", true);

  const startDate = parsedDate.startOf("day").toDate();
  const endDate = parsedDate.endOf("day").toDate();

  Event.find({
    date: {
      $gte: startDate, // Greater than or equal to the start of the day
      $lte: endDate, // Less than or equal to the end of the day
    },
  }).then((data) => {
    if (data) {
      res.json({
        result: true,
        message: "Sucessful search",
        EventsOnDate: data,
      });
    } else {
      res.json({
        result: false,
        message: `No event found on the ${date}`,
      });
    }
  });
});

// SEARCH EVENT BASED ON ID
// router.get("/search/:id", (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({
//       result: false,
//       message: "Invalid event ID.",
//     });
//   }
//   // Event.findById({ _id: id }).then((data) => {
//   //   if (data) {
//   //     res.json({
//   //       result: true,
//   //       message: "Single event found.",
//   //       singleEvent: data,
//   //     });
//   //   }
//   // });
//   // });
//   Event.findById({ _id: id })
//     .then((event) => {
//       if (!event) {
//         return res
//           .status(404)
//           .json({ result: false, message: "Event not found." });
//       }
//       res.json({ result: true, message: "Event found", singleEvent: event });
//     })
//     .catch((err) => {
//       res
//         .status(500)
//         .json({ result: false, message: "Server error", error: err.message });
//     });
// });

// iMPORT

router.get("/search/:id", (req, res) => {
  const { id } = req.params; // Handles route parameter: /search/66e24f095b0beff195eb0014

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      result: false,
      message: "Invalid event ID.",
    });
  }

  Event.findById(id)
    .populate("createdBy", "username")
    .then((event) => {
      if (!event) {
        return res.status(404).json({
          result: false,
          message: "Event not found.",
        });
      }
      res.json({ result: true, message: "Event found", singleEvent: event });
    })
    .catch((err) => {
      res.status(500).json({
        result: false,
        message: "Server error",
        error: err.message,
      });
    });
});

//REGISTER TO AN EVENT
router.put("/register/:eventID/:username", (req, res) => {
  const { username, eventID } = req.params;

  Event.findById(eventID).then((event) => {
    if (!event) {
      return res.json({ result: false, message: "Event not found." });
    }
    if (event.participants.includes(username)) {
      return res.json({ result: false, message: "User already registered." });
    }
    if (event.participants.length >= event.slots) {
      return res.json({ result: false, message: "Event is full." });
    }

    Event.updateOne(
      { _id: eventID },
      { $push: { participants: username } }
    ).then((event) => {
      if (!event) {
        return res.json({ result: false, message: "Event not found." });
      }
      if (event.participants.includes(username)) {
        return res.json({ result: false, message: "User already registered." });
      }
      if (event.participants.length >= event.slots) {
        return res.json({ result: false, message: "Event is full." });
      }

      res.json({
        result: true,
        message: "User registered to event.",
        registeredUsers: event.participants,
      });
    });
  });
});

module.exports = router;
