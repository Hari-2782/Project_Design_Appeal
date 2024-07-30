import React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

import {
  Box,
  Avatar,
  Grid,
  Typography,
  Paper,
  Rating as MuiRating,
  CssBaseline,
  Button,
} from "@mui/material";

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

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const reviews = [
  {
    id: 1,
    rating: 5,
    review: "Excellent! Will definitely use again.",
    userName: "Jane Smith",
    userImage: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    rating: 4,
    review: "Great service, really enjoyed the experience!",
    userName: "John Doe",
    userImage:
      "https://cdn.britannica.com/29/215029-050-84AA8F39/British-actress-Emma-Watson-2017.jpg",
  },
  {
    id: 3,
    rating: 3,
    review: "Good, but room for improvement.",
    userName: "Bob Johnson",
    userImage: "https://randomuser.me/api/portraits/men/46.jpg",
  },
];

const ReviewCard = ({ review }) => (
  <Grid item xs={12} sm={6} md={4}>
    <StyledPaper>
      <StyledAvatar alt={review.userName} src={review.userImage} />
      <Typography variant="h6" gutterBottom>
        {review.userName}
      </Typography>
      <MuiRating value={review.rating} readOnly />
      <Typography variant="body1">{review.review}</Typography>
    </StyledPaper>
  </Grid>
);

const Rate = () => (
  <Box
    sx={{ flexGrow: 1, padding: 3, width: "100vw", boxSizing: "border-box" }}
  >
    <CssBaseline />
    <Typography variant="h4" align="center" color="#4B001E" gutterBottom>
      Testimonials!
    </Typography>
    <Grid container spacing={3}>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </Grid>
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
      <StyledButton variant="contained" component={Link} to="/ratings">
        More
      </StyledButton>
    </Box>
  </Box>
);

export default Rate;
