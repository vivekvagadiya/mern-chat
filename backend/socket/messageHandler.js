const messageService = require("../services/message.service");
const { broadcastToChat, joinChatRoom, leaveChatRoom } = require("./roomManager");

const handleMessageHandlers = (io, socket) => {
  // Join chat room
  socket.on("join_chat", async (data) => {
    try {
      const { chatId } = data;
      
      // Validate user is participant
      await messageService.getMessages(chatId, socket.userId, 1, 1);
      
      joinChatRoom(io, socket, chatId);
      
      // Notify others in the chat
      socket.to(chatId).emit("user_joined_chat", {
        userId: socket.userId,
        chatId,
      });
      
      socket.emit("chat_joined", { chatId });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // Leave chat room
  socket.on("leave_chat", (data) => {
    const { chatId } = data;
    leaveChatRoom(socket, chatId);
    socket.to(chatId).emit("user_left_chat", {
      userId: socket.userId,
      chatId,
    });
  });

  // Send new message
  socket.on("new_message", async (data) => {
    try {
      const { chatId, content, type = "text", mediaUrl = null } = data;
      
      const message = await messageService.sendMessage(chatId, socket.userId, {
        content,
        type,
        mediaUrl,
      });

      // Broadcast to all users in the chat
      broadcastToChat(io, chatId, "message_received", message);
      
      // Update chat's last message for all participants
      io.to(chatId).emit("chat_updated", {
        chatId,
        lastMessage: message,
      });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // Mark message as read
  socket.on("mark_read", async (data) => {
    try {
      const { messageId } = data;
      await messageService.markAsRead(messageId, socket.userId);
      
      // Notify sender that message was read
      const message = await messageService.getMessageById(messageId, socket.userId);
      broadcastToChat(io, message.chatId, "message_read", {
        messageId,
        readBy: socket.userId,
      });
    } catch (error) {
      socket.emit("error", { message: error.message });
    }
  });

  // Typing indicators
  socket.on("typing_start", (data) => {
    const { chatId } = data;
    socket.to(chatId).emit("user_typing", {
      userId: socket.userId,
      chatId,
    });
  });

  socket.on("typing_stop", (data) => {
    const { chatId } = data;
    socket.to(chatId).emit("user_stopped_typing", {
      userId: socket.userId,
      chatId,
    });
  });
};

module.exports = { handleMessageHandlers };