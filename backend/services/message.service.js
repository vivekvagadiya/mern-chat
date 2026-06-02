const Chat = require("../models/chat.model");
const Message = require("../models/message.model");

const getChatOrThrow = async (chatId) => {
  const chat = await Chat.findById(chatId)
    .select("participants type isActive");

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (!chat.isActive) {
    throw new Error("Chat is not active");
  }

  return chat;
};

const isParticipant = (chat, userId) => {
  return chat.participants.some(
    (participant) => {
      const participantId = participant._id ? participant._id.toString() : participant.toString();
      return participantId === userId.toString();
    }
  );
};
const sendMessage = async (
  chatId,
  userId,
  { content, type = "text", mediaUrl = null },
) => {
  // Validate input
  if (!content || content.trim().length === 0) {
    throw new Error("Message content is required");
  }
  
  if (content.length > 1000) {
    throw new Error("Message content cannot exceed 1000 characters");
  }

  const chat = await getChatOrThrow(chatId);

  if (!isParticipant(chat, userId)) {
    throw new Error("You are not a participant of this chat");
  }

  // Create message
  const message = await Message.create({
    chatId: chatId, // Use 'chat' instead of 'chatId' to match model
    senderId: userId, // Use 'sender' instead of 'senderId' to match model
    content: content.trim(),
    type: type, // Use 'messageType' instead of 'type'
    mediaUrl: mediaUrl, // Use 'fileUrl' instead of 'mediaUrl'
    readBy: [userId],
  });

  // Update chat's last message
  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: message._id,
    updatedAt: new Date(),
  });

  // Return populated message
  return await Message.findById(message._id)
    .populate("senderId", "username avatar")
    .select("-__v");
};
const getMessages = async (chatId, userId, page = 1, limit = 20) => {
  const chat = await getChatOrThrow(chatId);

  if (!isParticipant(chat, userId)) {
    throw new Error("You are not a participant of this chat");
  }

  // Validate and sanitize pagination
  page = Math.max(1, Number(page) || 1);
  limit = Math.min(50, Math.max(1, Number(limit) || 20));
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find({ 
      chatId: chatId, // Use 'chat' instead of 'chatId'
      isDeleted: { $ne: true } // Exclude deleted messages
    })
      .populate("senderId", "username avatar") // Use 'sender' instead of 'senderId'
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v")
      .lean(),

    Message.countDocuments({ 
      chatId: chatId,
      isDeleted: { $ne: true }
    }),
  ]);

  return {
    messages: messages.reverse(), // Show oldest first for chat UI
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

const markAsRead = async (messageId, userId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.isDeleted) {
    throw new Error("Cannot mark deleted message as read");
  }

  if (message.senderId.toString() === userId) {
    return message; // Sender doesn't need to mark their own message as read
  }

  // Check if user is a participant in the chat
  const chat = await getChatOrThrow(message.chatId);
  if (!isParticipant(chat, userId)) {
    throw new Error("You are not a participant of this chat");
  }

  return await Message.findByIdAndUpdate(
    messageId,
    {
      $addToSet: {
        readBy: userId,
      },
    },
    {
      new: true,
    }
  ).select("-__v");
};

const markChatAsRead = async (chatId, userId) => {
  const chat = await getChatOrThrow(chatId);

  if (!isParticipant(chat, userId)) {
    throw new Error("You are not a participant of this chat");
  }

  const result = await Message.updateMany(
    {
      chat: chatId, // Use 'chat' instead of 'chatId'
      sender: { $ne: userId }, // Use 'sender' instead of 'senderId'
      readBy: { $ne: userId },
      isDeleted: { $ne: true },
    },
    {
      $addToSet: {
        readBy: userId,
      },
    },
  );

  return {
    markedCount: result.modifiedCount,
    message: `Marked ${result.modifiedCount} messages as read`
  };
};

const editMessage = async (messageId, userId, content) => {
  // Validate input
  if (!content || content.trim().length === 0) {
    throw new Error("Message content is required");
  }

  const message = await Message.findById(messageId);
  
  if (!message) {
    throw new Error("Message not found");
  }
  
  if (message.isDeleted) {
    throw new Error("Cannot edit deleted message");
  }

  if (message.senderId.toString() !== userId.toString()) {
    throw new Error("You are not the sender of this message");
  }

  // Check if user is a participant in the chat
  const chat = await getChatOrThrow(message.chatId);
  if (!isParticipant(chat, userId)) {
    throw new Error("You are not a participant of this chat");
  }

  return await Message.findByIdAndUpdate(
    messageId,
    { 
      content: content.trim(),
      isEdited: true,
      editedAt: new Date()
    },
    { new: true }
  ).populate("senderId", "username avatar")
   .select("-__v");
};

const deleteMessage = async (messageId, userId) => {
  const message = await Message.findById(messageId);
  
  if (!message) {
    throw new Error("Message not found");
  }
  
  if (message.isDeleted) {
    throw new Error("Message already deleted");
  }

  if (message.senderId.toString() !== userId.toString()) {
    throw new Error("You are not the sender of this message");
  }

  // Check if user is a participant in the chat
  const chat = await getChatOrThrow(message.chatId);
  if (!isParticipant(chat, userId)) {
    throw new Error("You are not a participant of this chat");
  }

  return await Message.findByIdAndUpdate(
    messageId,
    {
      isDeleted: true,
      deletedAt: new Date(),
      content: "This message has been deleted", // Optional: clear content
    },
    { new: true }
  ).select("-__v");
};

// Additional utility functions
const getMessageById = async (messageId, userId) => {
  const message = await Message.findById(messageId)
    .populate("senderId", "username avatar")
    .populate("chatId", "type")
    .populate("chatId", "participants");

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.isDeleted) {
    throw new Error("Message has been deleted");
  }

  // Check if user is a participant in the chat
  if (!isParticipant(message.chatId, userId)) {
    throw new Error("You are not a participant of this chat");
  }

  return message;
};

const getUnreadCount = async (chatId, userId) => {
  const chat = await getChatOrThrow(chatId);

  if (!isParticipant(chat, userId)) {
    throw new Error("You are not a participant of this chat");
  }

  const count = await Message.countDocuments({
    chatId: chatId,
    senderId: { $ne: userId },
    readBy: { $ne: userId },
    isDeleted: { $ne: true }
  });

  return { unreadCount: count };
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  markChatAsRead,
  editMessage,
  deleteMessage,
  getMessageById,
  getUnreadCount,
};