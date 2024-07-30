import React, { useState, useEffect } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import {
  Box,
  Avatar,
  Grid,
  Typography,
  Paper,
  Rating as MuiRating,
  CssBaseline,
} from "@mui/material";
import axios from "axios";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  margin: theme.spacing(1),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  margin: "auto",
}));

const ReviewCard = ({ review }) => (
  <Grid item xs={12} sm={6} md={4}>
    <StyledPaper>
      <StyledAvatar alt="User Image" src="https://via.placeholder.com/150" />
      <Typography variant="h6" gutterBottom>
        {review.userName || "Anonymous"}
      </Typography>
      <MuiRating value={review.rating} readOnly />
      <Typography variant="body1">{review.review}</Typography>
    </StyledPaper>
  </Grid>
);

const Rate = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reviews");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <Box
      sx={{ flexGrow: 1, padding: 3, width: "100vw", boxSizing: "border-box" }}
    >
      <CssBaseline />
      <Typography variant="h4" align="center" color="#4B001E" gutterBottom>
        Testimonials!
      </Typography>
      <Grid container spacing={3}>
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </Grid>
    </Box>
  );
};

export default Rate;
