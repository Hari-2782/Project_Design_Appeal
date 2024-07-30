const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log("Token received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      console.log("Token decoded:", decoded);
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
  } else {
    console.error("No token provided");
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = { protect };
