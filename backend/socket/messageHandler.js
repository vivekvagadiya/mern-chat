const messageService = require("../services/message.service");
const { broadcastToChat, joinChatRoom, leaveChatRoom } = require("./roomManager");
const { socketValidators } = require("./socketValidation.middleware");

const handleMessageHandlers = (io, socket) => {
  // Join chat room
  socket.on("join_chat", socketValidators.joinChat(async (validatedData) => {
    const { chatId } = validatedData;
    
    // Validate user is participant
    await messageService.getMessages(chatId, socket.userId, 1, 1);
    
    joinChatRoom(io, socket, chatId);
    
    // Notify others in the chat
    socket.to(chatId).emit("user_joined_chat", {
      userId: socket.userId,
      chatId,
    });
    
    socket.emit("chat_joined", { chatId });
  }));

  // Leave chat room
  socket.on("leave_chat", socketValidators.leaveChat((validatedData) => {
    const { chatId } = validatedData;
    
    leaveChatRoom(socket, chatId);
    socket.to(chatId).emit("user_left_chat", {
      userId: socket.userId,
      chatId,
    });
  }));

  // Send new message
  socket.on("new_message", socketValidators.newMessage(async (validatedData) => {
    const { chatId, content, type, mediaUrl } = validatedData;
    
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
  }));

  // Mark message as read
  socket.on("mark_read", socketValidators.markRead(async (validatedData) => {
    const { messageId } = validatedData;
    
    await messageService.markAsRead(messageId, socket.userId);
    
    // Notify sender that message was read
    const message = await messageService.getMessageById(messageId, socket.userId);
    broadcastToChat(io, message.chatId, "message_read", {
      messageId,
      readBy: socket.userId,
    });
  }));

  // Typing indicators
  socket.on("typing_start", socketValidators.typingStart((validatedData) => {
    const { chatId } = validatedData;
    
    socket.to(chatId).emit("user_typing", {
      userId: socket.userId,
      chatId,
    });
  }));

  socket.on("typing_stop", socketValidators.typingStop((validatedData) => {
    const { chatId } = validatedData;
    
    socket.to(chatId).emit("user_stopped_typing", {
      userId: socket.userId,
      chatId,
    });
  }));
};

module.exports = { handleMessageHandlers };