import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { styled } from "@mui/system";

const CustomCard = styled(Card)(({ selected }) => ({
  height: "100%",
  border: selected ? "2px solid #008080" : "1px solid #ddd",
  boxShadow: selected
    ? "0 4px 12px rgba(0, 128, 128, 0.5)"
    : "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const JerseySelector = ({
  selectedOptions,
  setSelectedOptions,
  handleConfirm,
}) => {
  const jerseys = [
    {
      type: "Full Sleeve",
      sizes: ["S", "M", "L", "XL", "XXL"],
      price: "850",
    },
    {
      type: "Half Sleeve",
      sizes: ["S", "M", "L", "XL", "XXL"],
      price: "650",
    },
    {
      type: "Sleeveless",
      sizes: ["S", "M", "L", "XL", "XXL"],
      price: "550",
    },
  ];

  const handleTypeSelect = (type) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      type,
      size: "",
      price: jerseys.find((jersey) => jersey.type === type)?.price || "",
    }));
  };

  const handleTypeOptionChange = (type, event) => {
    const { name, value } = event.target;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      type,
      [name]: value,
    }));
  };

  return (
    <Grid container spacing={2}>
      {jerseys.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.type}>
          <CustomCard
            selected={selectedOptions.type === item.type}
            onClick={() => handleTypeSelect(item.type)}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {item.type}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Price: LKR.{item.price}
              </Typography>
              <Box mt={2}>
                <FormControl component="fieldset" fullWidth margin="normal">
                  <FormLabel component="legend">Size</FormLabel>
                  <RadioGroup
                    row
                    name="size"
                    value={
                      selectedOptions.type === item.type
                        ? selectedOptions.size
                        : ""
                    }
                    onChange={(event) =>
                      handleTypeOptionChange(item.type, event)
                    }
                  >
                    {item.sizes.map((size) => (
                      <FormControlLabel
                        key={size}
                        value={size}
                        control={<Radio />}
                        label={size}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            </CardContent>
          </CustomCard>
        </Grid>
      ))}
      {selectedOptions.type && (
        <Grid item xs={12} style={{ textAlign: "center", marginTop: "16px" }}>
          <Typography variant="h6">
            Selected Apparel Price: Lkr{selectedOptions.price}.00
          </Typography>
        </Grid>
      )}
      <Grid item xs={12} style={{ textAlign: "center", marginTop: "16px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleConfirm(selectedOptions)}
        >
          Confirm
        </Button>
      </Grid>
    </Grid>
  );
};

export default JerseySelector;
