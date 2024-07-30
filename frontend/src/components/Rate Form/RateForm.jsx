import React, { useState } from 'react';
import { Typography, TextField, Button, Rating, Container, Box } from '@mui/material';
import { Transform } from '@mui/icons-material';

const RateForm = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Rating:', rating);
    console.log('Review:', review);
    
    // Reset the form
    setRating(0);
    setReview('');
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: '0'
      }}
    >
      <Box
        p={4}
        boxShadow={3}
        borderRadius={4}
        style={{
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: 'translateX(100%)',
        }}
      >
        <Typography variant="h4" align="center" color="#4B001E" gutterBottom>
          Share your experience
        </Typography>
        <Box display="flex" justifyContent="center" mb={2}>
          <Rating
            name="rating"
            value={rating}
            onChange={handleRatingChange}
            precision={0.5}
          />
        </Box>
        <TextField
          multiline
          rows={4}
          variant="outlined"
          margin="normal"
          fullWidth
          id="review"
          label="Write your review"
          name="review"
          value={review}
          onChange={handleReviewChange}
        />
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#4B001E',
              color: 'white',
              '&:hover': {
                backgroundColor: '#3a0015'
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RateForm;
