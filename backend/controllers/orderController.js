const Order = require('../models/Order');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({
      ...order.toObject(),
      orderNumber: order.formatOrderNumber(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    const formattedOrders = orders.map(order => ({
      ...order.toObject(),
      orderNumber: order.formatOrderNumber(),
    }));
    res.status(200).json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({
      ...order.toObject(),
      orderNumber: order.formatOrderNumber(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { state } = req.body; // Get the new status from the request body
  
      // Valid states for the order
      const validStates = ['processing', 'accepted', 'conduct', 'finalizing', 'process', 'finished', 'shipped', 'delivered', 'rejected'];
      if (!validStates.includes(state)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      // Find and update the order
      const order = await Order.findByIdAndUpdate(id, { state: state }, { new: true, runValidators: true });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const user = await User.findById(order.userId); // Assuming the order has a userId field
  
      if (user) {
        let subject, text;
  
        // Only send email for the specified states
        switch (state) {
          case 'accepted':
            subject = `Order Accepted: ${order.formatOrderNumber()}`;
            text = `Your order ${order.formatOrderNumber()} has been accepted.`;
            break;
          case 'finished':
            subject = `Order Finished: ${order.formatOrderNumber()}`;
            text = `Your order ${order.formatOrderNumber()} is finished.`;
            break;
          case 'delivered':
            subject = `Order Delivered: ${order.formatOrderNumber()}`;
            text = `Your order ${order.formatOrderNumber()} has been delivered.`;
            break;
          case 'rejected':
            subject = `Order Rejected: ${order.formatOrderNumber()}`;
            text = `Your order ${order.formatOrderNumber()} has been rejected.`;
            break;
          default:
            // No email for other states
            break;
        }
  
        // Send email if subject and text are defined
        if (subject && text) {
          await sendEmail(user.email, subject, text);
        }
      }
  
      res.status(200).json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
          return res.status(400).json({ message: 'Order ID is required' });
        }
    
        const result = await Order.findByIdAndDelete(orderId);
        if (!result) {
          return res.status(404).json({ message: 'Order not found' });
        }
    
        res.status(200).json({ message: 'Order deleted successfully' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }

    
  };

// exports.bulkDeleteOrders = async (req, res) => {
//     try {
//       const { ids } = req.body; // Get the array of order IDs from the request body
  
//       if (!Array.isArray(ids) || ids.length === 0) {
//         return res.status(400).json({ message: 'No order IDs provided' });
//       }
  
//       // Delete orders with the specified IDs
//       const result = await Order.deleteMany({ _id: { $in: ids } });
  
//       if (result.deletedCount === 0) {
//         return res.status(404).json({ message: 'No orders found to delete' });
//       }
  
//       res.status(200).json({ message: 'Orders deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
//   // Update order status endpoint
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { selectedItems, status } = req.body;
//     const updateData = {};

//     if (selectedItems !== undefined) {
//       updateData.selectedItems = selectedItems;
//     }

//     if (status !== undefined) {
//       updateData.state = status;
//     }

//     const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
//     res.status(200).json({
//       ...order.toObject(),
//       orderNumber: order.formatOrderNumber(),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
