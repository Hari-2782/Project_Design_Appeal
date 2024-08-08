import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider, Button, styled } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0px 6px 25px rgba(0, 0, 0, 0.2)',
  },
}));

const ReviewInfoTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

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
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        Pending Reviews
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />
      {error && <Typography color="error">{error}</Typography>}
      {reviews.map(review => (
        <StyledPaper key={review._id}>
          <ReviewInfoTypography variant="h6">{review.userName}</ReviewInfoTypography>
          <ReviewInfoTypography variant="body1">{review.review}</ReviewInfoTypography>
          <ReviewInfoTypography variant="body2">Rating: {review.rating}</ReviewInfoTypography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleApprove(review._id)}
              sx={{ marginRight: 1 }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleReject(review._id)}
            >
              Reject
            </Button>
          </Box>
        </StyledPaper>
      ))}
    </Box>
  );
};

export default AdminReviewList;