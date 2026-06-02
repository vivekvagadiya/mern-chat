const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { addUserSocket, removeUserSocket } = require("./roomManager");
const { handleMessageHandlers } = require("./messageHandler");

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) return next(new Error("User not found"));

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Handle connections
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);
    addUserSocket(socket.userId, socket.id);

    // Set up message handlers
    handleMessageHandlers(io, socket);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      removeUserSocket(socket.userId);
      
      // Notify all chats that user went offline
      socket.broadcast.emit("user_offline", {
        userId: socket.userId,
      });
    });

    // Notify user is online
    socket.broadcast.emit("user_online", {
      userId: socket.userId,
    });
  });

  return io;
};

module.exports = { initializeSocket };