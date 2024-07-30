import * as React from "react";
import Button from "../Button";
import Typography from "../Typography";
import HomeHLayout from "./HomeHLayout";
import Box from "@mui/material/Box";

const backgroundImage =
  "https://cdns.crestline.com/crestline/How-to-pick-the-best-tshirt-variety.jpg";

export default function ProductHero() {
  return (
    <HomeHLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: "rgba(0, 0, 1, 0.3)", // Adjusted background color for overlay effect
      }}
    >
      <img
        style={{ display: "none" }}
        src={backgroundImage}
        alt="increase priority"
      />
      <Box
        sx={{
          textAlign: "left",
          maxWidth: 650,
          mt: 16,
          mb: 4,
          ml: { xs: -12, sm: -14, md: -85 },
          boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.3)", // Adding 3D shadow effect
          padding: "20px", // Adding some padding to enhance the shadow effect
          backgroundColor: "white", // Optional background color for contrast
        }}
      >
        <Typography color="#023075" variant="h2" marked="center" gutterBottom>
          Customize Your Perfect T-Shirt with Ease!
        </Typography>
        <Typography color="grey" variant="h5" gutterBottom>
          Premier T-Shirt Design and Customization Services
        </Typography>
        <Typography color="grey" variant="h5" gutterBottom>
          Bring Your Ideas to Life with Our Expert Designers
        </Typography>
        <Typography color="grey" variant="h5" gutterBottom>
          Affordable Pricing!
        </Typography>
        <Box sx={{ mb: 4, mt: { xs: 4, sm: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "white",
                mr: 1,
              }}
            />
            <Typography color="black" variant="h5">
              Save Big on Every Order
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "white",
                mr: 1,
              }}
            />
            <Typography color="black" variant="h5">
              Satisfaction Guaranteed
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "white",
                mr: 1,
              }}
            />
            <Typography color="#081426" variant="h5">
              Pay Only When You’re Thrilled
            </Typography>
          </Box>
        </Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          component="a"
          href="//sign-up/"
          sx={{
            minWidth: 250,
            backgroundColor: "#282c34",
            color: "white",
            fontWeight: "bold",
            padding: "12px 24px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#4170cf",
            },
          }}
        >
          Register
        </Button>

        <Typography
          variant="body2"
          color="grey"
          alignItems="center"
          sx={{ marginLeft: 5, mt: 2 }}
        >
          Discover the experience
        </Typography>
      </Box>
    </HomeHLayout>
  );
}
