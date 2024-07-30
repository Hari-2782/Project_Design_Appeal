import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
      } catch (err) {
        setError("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const handleViewProfile = async (customerId) => {
    try {
      const response = await axios.get(`/api/users/${customerId}`);
      setSelectedCustomer(response.data);
      setProfileOpen(true);
    } catch (err) {
      setError("Error fetching customer details.");
    }
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
  };

  const handleProcess = (orderId) => {
    setSelectedOrder(orderId);
    navigate('/admin/orders/OrderStatus');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (orders.length === 0) return <Typography>No orders available.</Typography>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Order Details</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderNumber}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.orderDetails}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewProfile(order.userId)}
                    sx={{ mr: 2 }}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleProcess(order.orderNumber)}
                  >
                    Process
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={profileOpen} onClose={handleCloseProfile}>
        <DialogTitle>Customer Profile</DialogTitle>
        <DialogContent>
          {selectedCustomer ? (
            <Box>
              <Typography><strong>Name:</strong> {selectedCustomer.name}</Typography>
              <Typography><strong>Email:</strong> {selectedCustomer.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedCustomer.mobileNo}</Typography>
              {/* Add more customer details as needed */}
            </Box>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfile} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default OrderDetails;
