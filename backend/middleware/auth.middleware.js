// backend/middleware/auth.middleware.js (enhanced)
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const {apiResponse} = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return apiResponse.error(res, 'Access denied. No token provided.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return apiResponse.error(res, 'Invalid token. User not found.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return apiResponse.error(res, 'Invalid token.', 401);
  }
};

module.exports = authenticate;