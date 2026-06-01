// backend/service/auth.service.js
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { generateTokens } = require("../utils/generateTokens.js");

const register = async (username, email, password) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await User.create({ username, email, password });

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  console.log('user',user);
  
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid credentials");
  }

  // Update online status
  user.isOnline = true;
  user.lastSeen = new Date();
  await user.save();

  const tokens = generateTokens(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
    ...tokens,
  };
};

const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new Error("Invalid refresh token");
  }

  const tokens = generateTokens(user._id);
  return tokens;
};

const logout = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.isOnline = false;
    user.lastSeen = new Date();
    await user.save();
  }
  return true;
};

module.exports = { register, login, refreshToken, logout };
