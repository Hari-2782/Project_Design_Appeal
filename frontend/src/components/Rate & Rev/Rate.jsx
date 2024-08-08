import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Divider, Rating } from '@mui/material';
import { styled } from '@mui/system';

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

const UserNameTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const ReviewTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const RatingTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.secondary.main,
  display: 'flex',
  alignItems: 'center',
}));

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
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
         Reviews
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />
      {reviews.map(review => (
        <StyledPaper key={review._id}>
          <UserNameTypography variant="h6">{review.userName}</UserNameTypography>
          <ReviewTypography variant="body1">{review.review}</ReviewTypography>
          <RatingTypography variant="body2">
            Rating: <Rating value={review.rating} readOnly precision={0.5} size="small" sx={{ ml: 1 }} />
          </RatingTypography>
        </StyledPaper>
      ))}
    </Box>
  );
};

export default ApprovedReviewList;
