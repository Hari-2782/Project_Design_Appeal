import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Button } from '@mui/material';

const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews/pending');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching pending reviews:', error);
        setError('Error fetching pending reviews');
      }
    };

    fetchPendingReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/reviews/approve/${id}`);
      setReviews(reviews.filter(review => review._id !== id));
    } catch (error) {
      console.error('Error approving review:', error);
      setError('Error approving review');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/reviews/reject/${id}`);
      setReviews(reviews.filter(review => review._id !== id));
    } catch (error) {
      console.error('Error rejecting review:', error);
      setError('Error rejecting review');
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Pending Reviews
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {reviews.map(review => (
        <Paper key={review._id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{review.userName}</Typography>
          <Typography variant="body1">{review.review}</Typography>
          <Typography variant="body2">Rating: {review.rating}</Typography>
          <Button variant="contained" color="primary" onClick={() => handleApprove(review._id)}>
            Approve
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleReject(review._id)}>
            Reject
          </Button>
        </Paper>
      ))}
    </Box>
  );
};

export default AdminReviewList;
