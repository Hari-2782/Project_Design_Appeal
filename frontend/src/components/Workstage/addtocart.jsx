import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Typography,
  Paper,
  Divider,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Container,
  List,
  Tooltip,
  IconButton
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import generateHash from './hashGenerator'; // Ensure this function is available

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      const handleOrderCompletion = async () => {
        await Promise.all(
          cartItems
            .filter((item) => item.selected)
            .map((item) => axios.delete(`/api/cart/${item._id}`))
        );
        setCartItems(cartItems.filter((item) => !item.selected));
      };
      handleOrderCompletion();
    }
  }, [orderId, cartItems]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("/api/cart");
        setCartItems(response.data.map(item => ({ ...item, selected: false })));
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();
  }, []);

  const handleRemove = async (id) => {
    try {
      const item = cartItems.find(item => item._id === id);
      if (item) {
        const materialResponse = await axios.get(`/api/materials/name/${item.materialName}`);
        const material = materialResponse.data;
        if (!material) {
          console.error("Material not found.");
          return;
        }
        await axios.put(`/api/materials/name/${item.materialName}`, {
          quantity: material.quantity + item.quantity
        });

        await axios.delete(`/api/cart/${id}`);
        setCartItems(cartItems.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    try {
      const item = cartItems.find(item => item._id === id);
      if (item) {
        const materialResponse = await axios.get(`/api/materials/name/${item.materialName}`);
        const material = materialResponse.data;
        if (!material) {
          console.error("Material not found.");
          return;
        }
        const quantityDifference = newQuantity - item.quantity;
        if (quantityDifference > 0 && material.quantity < quantityDifference) {
          alert('Requested quantity exceeds available material quantity.');
          return;
        }
        const updatedQuantity = material.quantity - quantityDifference;
        await axios.put(`/api/materials/name/${item.materialName}`, {
          quantity: updatedQuantity
        });
        setCartItems(cartItems.map(cartItem =>
          cartItem._id === id ? { ...cartItem, quantity: newQuantity, availableQuantity: updatedQuantity } : cartItem
        ));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleSelect = (id) => {
    setCartItems(cartItems.map(item =>
      item._id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleCheckout = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    try {
      const selectedItems = cartItems.filter(item => item.selected);
      if (selectedItems.length === 0) {
        alert('No items selected for checkout.');
        setIsProcessing(false);
        return;
      }

      const cartDetails = selectedItems.map(item => ({
        materialName: item.materialName,
        apparelType: item.selectedApparel.type,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      }));
      const total = selectedItems.reduce((total, item) => total + (item.totalPrice * item.quantity), 0);

      const orderDetails = cartDetails.map(item => `${item.materialName} - ${item.apparelType} - ${item.quantity}`).join(', ');

      const response = await axios.post("/api/orders", {
        customerName: userInfo.name,
        orderDetails,
        userId: userInfo._id,
        total
      });

      const formData = {
        merchant_id: '1227808',
        return_url: 'http://localhost:5173/cart',
        cancel_url: 'http://localhost:5173/cart',
        notify_url: 'http://localhost:5000/api/payment/webhook',
        order_id: response.data._id,
        items: `Order ${response.data._id}`,
        currency: 'LKR',
        amount: total,
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
        city: userInfo.city,
        country: 'Sri Lanka',
      };

      const hash = generateHash(
        'MzU0NjEzODM5OTE5Mzk3ODAyNDgxMTEwNjA1NTY0OTE3Njk2NzM5', 
        formData.merchant_id,
        formData.order_id,
        formData.amount,
        formData.currency
      );



      // Submit the form programmatically
      setTimeout(() => {
        document.getElementById("payment-form").submit();
      }, 1000);

    } catch (error) {
      console.error("Error processing order:", error);
      setIsProcessing(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCart sx={{ mr: 2 }} />
          Your Shopping Cart
        </Typography>
        {cartItems.length === 0 ? (
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">Your cart is empty.</Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Box>
            <List>
              {cartItems.map((item) => {
                const materialPrice = item.materialPrice > 0 ? item.materialPrice : 50;

                return (
                  <Card key={item._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Checkbox
                            checked={item.selected}
                            onChange={() => handleSelect(item._id)}
                          />
                        </Grid>
                      
                        <Grid item xs={12} sm={3}>
                          <CardMedia
                            component="img"
                            image={item.imageDataURL}
                            alt="Apparel Design"
                            sx={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
                          />
                        </Grid>
                     
                        <Grid item xs={12} sm={6}>
                          <Typography variant="h6">{item.selectedApparel.type}</Typography>
                          <Typography variant="body2" color="text.secondary">Material: {item.materialName}</Typography>
                          {item.text && (
                            <Typography variant="body2" color="text.secondary">Text: {item.text}</Typography>
                          )}
                          <Box sx={{ mt: 1 }}>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Typography variant="body2">Material: ${materialPrice}</Typography>
                                <Typography variant="body2">Color: ${item.colorPrice}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                {item.imageDataURL && <Typography variant="body2">Image: ${item.imagePrice}</Typography>}
                                {item.text && <Typography variant="body2">Text: ${item.textPrice}</Typography>}
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        {!isProcessing && (
                      <Tooltip title="Remove">
                        <IconButton edge="end" onClick={() => handleRemove(item._id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                        <Grid item xs={12} sm={3}>
                          <Typography variant="h6" color="primary">${item.totalPrice}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <IconButton
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              size="small"
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <TextField
                              value={item.quantity}
                              variant="outlined"
                              size="small"
                              inputProps={{ readOnly: true, style: { textAlign: 'center', width: '40px' } }}
                            />
                            <IconButton
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              disabled={item.quantity >= item.availableQuantity}
                              size="small"
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                 
                  </Card>
                );
              })}
            </List>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">
                Total: ${cartItems.reduce((total, item) => item.selected ? total + (item.totalPrice * item.quantity) : total, 0).toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleCheckout}
                disabled={isProcessing}
                startIcon={isProcessing ? <CircularProgress size={24} /> : <ShoppingCart />}
              >
                {isProcessing ? "Processing..." : "Checkout"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Hidden payment form */}
      <form id="payment-form" method="post" action="https://sandbox.payhere.lk/pay/checkout">
        {Object.entries(formData).map(([key, value]) => (
          <input type="hidden" name={key} value={value} key={key} />
        ))}
        <input type="submit" value="Buy Now" style={{ display: 'none' }} />
      </form>
    </Container>
  );
};

export default AddToCart;
