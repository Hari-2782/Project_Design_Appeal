const Review = require("../models/reviewModel");

// Submit a new review
const submitReview = async (req, res) => {
  try {
    const { userName, rating, review } = req.body;
    const newReview = new Review({ userName, rating, review, status: 'pending' });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error });
  }
};

// Get pending reviews
const getPendingReviews = async (req, res) => {
  try {
    const pendingReviews = await Review.find({ status: 'pending' });
    res.json(pendingReviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending reviews', error });
  }
};
const getaproveReviews = async (req, res) => {
  try {
    const acceptReviews = await Review.find({ status: 'approved' });
    res.json(acceptReviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending reviews', error });
  }
};
// Approve a review
const approveReview = async (req, res) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.json({ message: 'Review approved' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving review', error });
  }
};

// Reject a review
const rejectReview = async (req, res) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.json({ message: 'Review rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting review', error });
  }
};

module.exports = {
  submitReview,
  getPendingReviews,
  approveReview,
  rejectReview,
  getaproveReviews,
};
