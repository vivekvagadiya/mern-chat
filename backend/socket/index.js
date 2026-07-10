const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const {
  addUserSocket,
  removeUserSocket,
  getOnlineUsers,
} = require("./roomManager");
const { handleMessageHandlers } = require("./messageHandler");

const initializeSocket = (httpServer) => {
  const clientUrl = process.env.CLIENT_URL
    ? process.env.CLIENT_URL
    : "http://localhost:3000";

  const io = new Server(httpServer, {
    cors: {
      origin: [
        clientUrl,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      console.log("token", token);
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
    addUserSocket(socket.userId, socket.id, socket.user);

    // Send current online users list to the newly connected user
    getOnlineUsers({ userId: socket.userId })
      .then((onlineUsers) => {
        socket.emit("online_users", onlineUsers);
        console.log(
          `📊 Sent online users list to ${socket.user.name}: ${onlineUsers.length} users`,
        );
      })
      .catch((error) => {
        console.error("Error getting online users:", error);
        socket.emit("online_users", []);
      });

    // Notify others that this user is online
    socket.broadcast.emit("user_online", socket.user);

    // Set up message handlers
    handleMessageHandlers(io, socket);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      const disconnectedUser = removeUserSocket(socket.userId);

      if (disconnectedUser) {
        // Notify all chats that user went offline
        socket.broadcast.emit("user_offline", disconnectedUser);
        console.log(
          `📡 Notified others that ${disconnectedUser.username} went offline`,
        );
      }
    });
  });

  return io;
};

module.exports = { initializeSocket };
