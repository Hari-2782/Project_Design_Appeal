const Feedback = require('../models/feedbackModel');

// Controller to handle creating feedback
const createFeedback = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const feedback = new Feedback({ name, email, message });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

// Controller to handle retrieving all feedback
const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback', error: error.message });
    }
};

module.exports = { createFeedback, getFeedbacks };
