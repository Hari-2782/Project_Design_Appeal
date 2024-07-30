import React, { useState, useEffect } from 'react';
import './OrderHistory.css'; // Import CSS file for styling
import { FaTrash } from 'react-icons/fa'; // Import delete icon from react-icons library

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Ensure the orderId is correctly used
  const handleSingleDelete = async (orderId) => {
    console.log('Deleting order with id:', orderId); // Debugging line
  
    if (!orderId) {
      console.error('Invalid orderId:', orderId);
      return;
    }
  
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
  
      const updatedOrders = orders.filter(order => order.orderId !== orderId);
      setOrders(updatedOrders);
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      {/* Display loading spinner or error message */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Details</th>
              <th>Order State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {orders.map(order => (
    <tr key={order.orderId}>
      <td>{order.orderNumber}</td>
      <td>{order.orderDetails}</td>
      <td>{order.state}</td>
      <td>
        <button 
          className="delete-button" 
          onClick={() => handleSingleDelete(order._id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
};

export default OrderHistory;
