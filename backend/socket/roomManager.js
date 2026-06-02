const userSocketMap = new Map(); // userId -> socketId

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

const addUserSocket = (userId, socketId) => {
  userSocketMap.set(userId, socketId);
};

const removeUserSocket = (userId) => {
  userSocketMap.delete(userId);
};

const getUserSocketId = (userId) => {
  return userSocketMap.get(userId);
};

module.exports = {
  joinChatRoom,
  leaveChatRoom,
  broadcastToChat,
  addUserSocket,
  removeUserSocket,
  getUserSocketId,
};