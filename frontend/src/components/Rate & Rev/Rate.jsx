import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper } from '@mui/material';

const ApprovedReviewList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews/approved');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching approved reviews:', error);
      }
    };

    fetchApprovedReviews();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Approved Reviews
      </Typography>
      {reviews.map(review => (
        <Paper key={review._id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{review.userName}</Typography>
          <Typography variant="body1">{review.review}</Typography>
          <Typography variant="body2">Rating: {review.rating}</Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default ApprovedReviewList;
