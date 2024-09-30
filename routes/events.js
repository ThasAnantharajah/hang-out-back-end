var express = require("express");
var router = express.Router();
const Event = require("../models/events");
const User = require("../models/users");

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
    desc: req.body.desc,
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
    .populate("participants", "name")
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

/// register

router.put("/register/:eventID/:userId", (req, res) => {
  const { eventID, userId } = req.params;

  // voir si user et event exist, si déjà registered, si slots dispo
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ result: false, message: "User not found." });
      }

      Event.findById(eventID)
        .then((event) => {
          if (!event) {
            return res
              .status(404)
              .json({ result: false, message: "Event not found." });
          }

          if (event.participants.length >= event.slots) {
            return res
              .status(400)
              .json({ result: false, message: "No available slots." });
          }

          const isAlreadyRegistered = event.participants.some(
            (participant) => participant.user.toString() === userId
          );
          if (isAlreadyRegistered) {
            return res
              .status(400)
              .json({ result: false, message: "User is already registered." });
          }

          Event.findByIdAndUpdate(
            eventID,
            {
              $push: { participants: { user: userId, isRegistered: true } },
            },
            { new: true }
          )
            .then((updatedEvent) => {
              res.status(200).json({
                result: true,
                message: "Registration successfull.",
                participantsUpdated: updatedEvent.participants,
              });
            })
            .catch(() => {
              res.status(500).json({
                result: false,
                message: "Error updating the event participants.",
              });
            });
        })
        .catch(() => {
          res
            .status(500)
            .json({ result: false, message: "Error finding event." });
        });
    })
    .catch(() => {
      res.status(500).json({ result: false, message: "Error finding user." });
    });
});

// unregister from event
// check user et event, check regist true, retirer particip
router.put("/unregister/:eventID/:userId", (req, res) => {
  const { eventID, userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ result: false, message: "User not found." });
      }

      Event.findById(eventID)
        .then((event) => {
          if (!event) {
            return res
              .status(404)
              .json({ result: false, message: "Event not found." });
          }

          const isRegistered = event.participants.some(
            (participant) => participant.user.toString() === userId
          );
          if (!isRegistered) {
            return res
              .status(400)
              .json({ result: false, message: "User is not registered yet." });
          }

          Event.findByIdAndUpdate(
            eventID,
            { $pull: { participants: { user: userId } } },
            { new: true }
          )
            .then((updatedEvent) => {
              res.status(200).json({
                result: true,
                message: "Unregistration successful.",
                participantsUpdated: updatedEvent.participants,
              });
            })
            .catch(() => {
              res
                .status(500)
                .json({
                  result: false,
                  message: "Error updating event's participants.",
                });
            });
        })
        .catch(() => {
          res
            .status(500)
            .json({ result: false, message: "Error finding event" });
        });
    })
    .catch(() => {
      res.status(500).json({ result: false, message: "Error finding user" });
    });
});

// retriev reg users
router.get("/:eventID/registered-users", (req, res) => {
  const { eventID } = req.params;

  Event.findById(eventID)
    .populate("participants.user", "name")
    .then((event) => {
      if (!event) {
        return res
          .status(404)
          .json({ result: false, message: "Event not found." });
      }

      const registeredUsers = event.participants.filter(
        (participant) => participant.isRegistered === true
      );

      res.status(200).json({
        result: true,
        registeredUsers: registeredUsers.map((participant) => ({
          userId: participant.user._id,
          name: participant.user.name,
        })),
      });
    })
    .catch(() => {
      res
        .status(500)
        .json({ result: false, message: "Error retrieving registered users." });
    });
});

module.exports = router;
