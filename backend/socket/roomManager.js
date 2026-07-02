const userSocketMap = new Map(); // userId -> { socketId, user, connectedAt }
const Chat = require("../models/chat.model");
const joinChatRoom = (io, socket, chatId) => {
  socket.join(chatId);
  console.log(`User ${socket.userId} joined chat ${chatId}`);
};

const leaveChatRoom = (socket, chatId) => {
  socket.leave(chatId);
  console.log(`User ${socket.userId} left chat ${chatId}`);
};

const broadcastToChat = (io, chatId, event, data, excludeSocket = null) => {
  if (excludeSocket) {
    excludeSocket.to(chatId).emit(event, data);
  } else {
    io.to(chatId).emit(event, data);
  }
};

const addUserSocket = (userId, socketId, user) => {
  userSocketMap.set(userId, {
    socketId,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status || "online",
    },
    connectedAt: new Date(),
  });
  console.log(`✅ User ${user.username} added to online users`);
};

const removeUserSocket = (userId) => {
  const userInfo = userSocketMap.get(userId);
  if (userInfo) {
    userSocketMap.delete(userId);
    return userInfo.user;
  }
  return null;
};

const getUserSocketId = (userId) => {
  const userInfo = userSocketMap.get(userId);
  return userInfo ? userInfo.socketId : null;
};

const getOnlineUsers = async ({ userId = null }) => {
  const onlineUsers = Array.from(userSocketMap.values()).map((userInfo) => ({
    ...userInfo.user,
    isOnline: true,
    connectedAt: userInfo.connectedAt,
  }));

  let filteredUsers = onlineUsers;

  if (userId) {
    // Filter out current user
    filteredUsers = onlineUsers.filter(
      (user) => user._id.toString() !== userId.toString(),
    );

    // Get user's conversations to filter online users
    try {
      const userChats = await Chat.find({
        participants: userId,
        type: "direct", // Only direct messages
      }).populate("participants", "_id username avatar email status");
      console.log("userChats", userChats);

      // Get IDs of users the current user has conversations with
      const conversationUserIds = new Set();
      userChats.forEach((chat) => {
        chat.participants.forEach((participant) => {
          if (participant._id.toString() !== userId.toString()) {
            conversationUserIds.add(participant._id.toString());
          }
        });
      });

      // Filter online users to only those in conversations
      filteredUsers = filteredUsers.filter((user) =>
        conversationUserIds.has(user._id.toString()),
      );
    } catch (error) {
      console.error("Error filtering online users by conversations:", error);
      // Fallback to just excluding current user
    }
  }

  return filteredUsers;
};

const isUserOnline = (userId) => {
  return userSocketMap.has(userId);
};

module.exports = {
  joinChatRoom,
  leaveChatRoom,
  broadcastToChat,
  addUserSocket,
  removeUserSocket,
  getUserSocketId,
  getOnlineUsers,
  isUserOnline,
};
