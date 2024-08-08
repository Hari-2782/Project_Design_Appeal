import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

function AdminCard({ title, value, icon }) {
  return (
    <Card sx={{ maxWidth: 250, m: 2, flex: "1 1 auto" }}>
      <CardActionArea>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 140,
          }}
        >
          <Box sx={{ width: "50%" }}>{icon}</Box>
        </CardContent>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {value}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function AdminCards() {
  const [customerCount, setCustomerCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [materialCount, setMaterialCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cusResponse = await axios.get("/api/users/all");
        setCustomerCount(cusResponse.data.length);

        const orderResponse = await axios.get("/api/orders");
        setOrderCount(orderResponse.data.length);

        const materialResponse = await axios.get("/api/materials");
        setMaterialCount(materialResponse.data.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const cardData = [
    {
      title: "CUSTOMERS",
      value: customerCount,
      icon: (
        <PeopleIcon
          sx={{ width: "100%", height: "auto", color: "text.secondary" }}
        />
      ),
    },
    {
      title: "ORDERS",
      value: orderCount,
      icon: (
        <ShoppingCartIcon
          sx={{ width: "100%", height: "auto", color: "text.secondary" }}
        />
      ),
    },
    {
      title: "MATERIALS",
      value: materialCount,
      icon: (
        <InventoryIcon
          sx={{ width: "100%", height: "auto", color: "text.secondary" }}
        />
      ),
    },
    {
      title: "PURCHASES",
      value: "75",
      icon: (
        <AttachMoneyIcon
          sx={{ width: "100%", height: "auto", color: "text.secondary" }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {cardData.map((card, index) => (
        <AdminCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </Box>
  );
}

export default AdminCards;
