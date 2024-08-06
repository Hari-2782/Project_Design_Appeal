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
import { Add, Remove, Delete, ShoppingCart, ThumbUp  } from '@mui/icons-material';
import generateHash from './hashGenerator'; 

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

// useEffect(() => {
//   if (orderId) {
//     const handleOrderCompletion = async () => {
//       try {
//         // Fetch the order details
//         const response = await axios.get(`/api/orders/${orderId}`);
//         const order = response.data;
//         const selectedItemIds = order.selectedItems; // Modify according to your actual response structure

//         // Filter cart items to delete those matching selected item IDs
//         const itemsToDelete = cartItems.filter((item) => selectedItemIds.includes(item._id));

//         // Perform the deletion of selected items from the cart
//         await Promise.all(
//           itemsToDelete.map((item) => axios.delete(`/api/cart/${item._id}`))
//         );

//         // Update the local state to reflect the changes
//         setCartItems(cartItems.filter((item) => !selectedItemIds.includes(item._id)));

//         // Clear the selected items in the order
//         await axios.put(`/api/${orderId}/update`, {
//           selectedItems: [], // Clear the selectedItems array
//         });

//       } catch (error) {
//         console.error("Error completing order:", error);
//       }
//     };

//     handleOrderCompletion();
//   }
// }, [orderId, cartItems]);


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("/api/cart");
        const userId = JSON.parse(localStorage.getItem('userInfo'))._id;
        const filteredItems = response.data.filter(item => item.userId === userId);
        setCartItems(filteredItems.map(item => ({ ...item, selected: false })));
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false); 
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

  const handleVote = async (imageURL) => {
    try {
      await axios.post("/api/votes/v", { imageURL });
      alert("Vote submitted successfully!");
    } catch (error) {
      console.error("Error voting for design:", error);
    }
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
      const selectedItemIds = selectedItems.map(item => item._id);
      const response = await axios.post("/api/orders", {
        customerName: userInfo.name,
        orderDetails,
        userId: userInfo._id,
        total,
        selectedItemIds
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
        'MTY0OTg2ODk5MTExMjgwOTcxMDIyMjU0MjkwNTEzNzQzOTA3Nzk1', 
        formData.merchant_id,
        formData.order_id,
        formData.amount,
        formData.currency
      );
      await Promise.all(selectedItems.map(item => axios.delete(`/api/cart/${item._id}`)));
      setCartItems(cartItems.filter(item => !item.selected));
      
      setFormData({ ...formData, hash });
      setTimeout(() => {
        document.getElementById("payment-form").submit();
      }, 1000);

    } catch (error) {
      console.error("Error processing order:", error);
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
                     
                        <Grid item xs={12} sm={3} container direction="column" spacing={1}>
                          <Grid item>
                            <Tooltip title="Increase Quantity">
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              >
                                <Add />
                              </IconButton>
                            </Tooltip>
                            <TextField
                              type="number"
                              size="small"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                              inputProps={{ min: 1 }}
                            />
                            <Tooltip title="Decrease Quantity">
                              <IconButton
                                size="small"
                                onClick={() => item.quantity > 1 && handleQuantityChange(item._id, item.quantity - 1)}
                              >
                                <Remove />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        
                          <Grid item>
                            <Typography variant="h6">
                              Total: ${(item.totalPrice * item.quantity).toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleVote(item.imageDataURL)}
                            >
                              Vote for Design
                              <ThumbUp sx={{ ml: 1 }} />
                            </Button>
                          </Grid>
                          <Grid item>
                            <Tooltip title="Remove Item">
                              <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => handleRemove(item._id)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Checkout'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <form id="payment-form" action="https://sandbox.payhere.lk/pay/checkout" method="POST" style={{ display: 'none' }}>
        {Object.entries(formData).map(([key, value]) => (
          <input type="hidden" name={key} value={value} key={key} />
        ))}
      </form>
    </Container>
  );
};

export default AddToCart;
