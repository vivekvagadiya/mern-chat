const messageService = require("../services/message.service");
const { broadcastToChat, joinChatRoom, leaveChatRoom } = require("./roomManager");
const { createSocketValidators } = require("./socketValidation.middleware");

const handleMessageHandlers = (io, socket) => {
  // Create validators for this specific socket
  const validators = createSocketValidators(socket);
  
  // Join chat room
  socket.on("join_chat", validators.joinChat(async (validatedData) => {
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
  socket.on("leave_chat", validators.leaveChat((validatedData) => {
    const { chatId } = validatedData;
    
    leaveChatRoom(socket, chatId);
    socket.to(chatId).emit("user_left_chat", {
      userId: socket.userId,
      chatId,
    });
  }));

  // Send new message - Handled via REST API to avoid duplication
  // socket.on("new_message", validators.newMessage(async (validatedData) => {
  //   const { chatId, content, type, mediaUrl } = validatedData;
  //   console.log('message received',validatedData)
  //   const message = await messageService.sendMessage(chatId, socket.userId, {
  //     content,
  //     type,
  //     mediaUrl,
  //   });
  // 
  //   // Broadcast to all users in the chat
  //   broadcastToChat(io, chatId, "message_received", message);
  //   
  //   // Update chat's last message for all participants
  //   io.to(chatId).emit("chat_updated", {
  //     chatId,
  //     lastMessage: message,
  //   });
  // }));

  // Mark message as read
  socket.on("mark_read", validators.markRead(async (validatedData) => {
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
  socket.on("typing_start", validators.typingStart((validatedData) => {
    const { chatId } = validatedData;
    
    socket.to(chatId).emit("user_typing", {
      userId: socket.userId,
      chatId,
    });
  }));

  socket.on("typing_stop", validators.typingStop((validatedData) => {
    const { chatId } = validatedData;
    
    socket.to(chatId).emit("user_stopped_typing", {
      userId: socket.userId,
      chatId,
    });
  }));
};

module.exports = { handleMessageHandlers };