const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");

const submitReview = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;

  if (!rating || !review) {
    res.status(400);
    throw new Error("Please add a rating and review");
  }

  try {
    const newReview = new Review({
      rating,
      review,
    });

    const createdReview = await newReview.save();

    res.status(201).json(createdReview);
  } catch (error) {
    console.error(`Error saving review: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const getReviews = asyncHandler(async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).json(reviews);
  } catch (error) {
    console.error(`Error fetching reviews: ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = { submitReview, getReviews };
