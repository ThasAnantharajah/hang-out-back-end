const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  adjectives: [String],
});

const Review = mongoose.model("adjectives", reviewSchema);

module.exports = Review;
