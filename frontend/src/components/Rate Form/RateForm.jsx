import React, { useState, useEffect } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Paper,
  Rating as MuiRating,
  CssBaseline,
  TextField,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from '@mui/material';
import axios from 'axios';
import Particles from 'react-tsparticles';
import { loadFull } from "tsparticles";
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const BackgroundBox = styled(Box)({
  backgroundImage: 'url(https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: theme.spacing(2, 0),
}));

const ReviewForm = ({ userName, addReview }) => {
  const [reviewData, setReviewData] = useState({ rating: 0, review: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      ...reviewData,
      userName: userName || 'Anonymous',
    };
    addReview(newReview);
    setReviewData({ rating: 0, review: '' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <MuiRating
        name="rating"
        value={reviewData.rating}
        onChange={(event, newValue) => setReviewData({ ...reviewData, rating: newValue })}
        size="large"
        sx={{ mb: 2 }}
      />
      <TextField
        name="review"
        label="Your Review"
        fullWidth
        multiline
        rows={4}
        value={reviewData.review}
        onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
        sx={{ mb: 2 }}
        variant="outlined"
      />
      <StyledButton type="submit" variant="contained" size="large">
        Submit Review
      </StyledButton>
    </Box>
  );
};

const AddReview = () => {
  const [userName, setUserName] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.name) {
      setUserName(userInfo.name);
    }
  }, []);

  const addReview = async (reviewData) => {
    if (!userName) {
      setErrorOpen(true);
      return;
    }

    const newReview = {
      ...reviewData,
      userName: userName || 'Anonymous',
      status: 'pending', // Set status to pending
    };

    try {
      await axios.post('http://localhost:5000/api/reviews', newReview);
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        navigate('/'); // Redirect to home page after 2 seconds
      }, 2000);
    } catch (error) {
      console.error('Error adding review:', error);
      setErrorOpen(true);
    }
  };

  const handleClose = () => {
    setSuccessOpen(false);
    setErrorOpen(false);
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 1, direction: "none", random: true, out_mode: "out" },
    },
  };

  return (
    <BackgroundBox>
      <CssBaseline />
      <Particles options={particlesOptions} init={particlesInit} />
      <Container maxWidth="sm">
        <Fade in={true} timeout={1000}>
          <StyledPaper elevation={6}>
            <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
              Share Your Wine Experience
            </Typography>
            {userName && (
              <Typography variant="h6" gutterBottom>
                Welcome, {userName}!
              </Typography>
            )}
            <ReviewForm userName={userName} addReview={addReview} />
          </StyledPaper>
        </Fade>
      </Container>
      <Dialog open={successOpen} onClose={handleClose}>
        <DialogTitle>Success!</DialogTitle>
        <DialogContent>
          <Typography>Your review has been submitted successfully. Redirecting to home page...</Typography>
        </DialogContent>
      </Dialog>
      <Dialog open={errorOpen} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>
            {userName ? "Failed to submit review. Please try again." : "You need to be logged in to submit a review."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </BackgroundBox>
  );
};

export default AddReview;
