const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const Message = require("../models/message.model");

const isAdmin = (chat, userId) => {
  return chat.admins.some(
    (adminId) => adminId.toString() === userId.toString(),
  );
};

const isParticipant = (chat, userId) => {
  return chat.participants.some((participant) => {
    // Handle both populated objects and raw IDs
    const participantId = participant._id
      ? participant._id.toString()
      : participant.toString();
    return participantId === userId.toString();
  });
};

const createDirectChat = async (userId, participantId) => {
  if (userId.toString() === participantId.toString()) {
    throw new Error("Cannot create direct chat with yourself");
  }

  const existingChat = await Chat.findOne({
    type: "direct",
    participants: {
      $all: [userId, participantId],
      $size: 2,
    },
  }).populate("participants", "username avatar");

  if (existingChat) {
    throw new Error("Direct chat already exists");
  }

  const chat = await Chat.create({
    type: "direct",
    participants: [userId, participantId],
    createdBy: userId,
  });

  return await Chat.findById(chat._id).populate(
    "participants",
    "username avatar",
  );
};

const getUserChats = async (userId) => {
  const chats = await Chat.find({
    participants: userId,
    isActive: true,
  })
    .select("-__v")
    .populate("participants", "username avatar")
    .populate({
      path: "lastMessage",
      select: "content senderId createdAt",
      populate: {
        path: "senderId",
        select: "username avatar",
      },
    })
    .sort({ updatedAt: -1 })
    .lean(); // Return plain JS objects

  return chats.map((chat) => {
    const processedChat = { ...chat };

    // 1-1 chat handling
    if (
      chat.type === "direct" &&
      chat.participants &&
      chat.participants.length === 2
    ) {
      const otherParticipant = chat.participants.find(
        (p) => p._id.toString() !== userId,
      );

      if (otherParticipant) {
        processedChat.avatar = otherParticipant.avatar;
        processedChat.name = otherParticipant.username;
      }
    }
    // group chat handling
    else if (chat.type === "group") {
      // processedChat.displayName = chat.name;
    }

    // last message formatting
    if (chat.lastMessage) {
      processedChat.lastMessagePreview = {
        content: chat.lastMessage.content,
        senderName: chat.lastMessage.senderId?.username || "Unknown",
        timestamp: chat.lastMessage.createdAt,
      };
    }

    return processedChat;
  });
};

const getChatById = async (chatId, userId = null) => {
  const chat = await Chat.findById(chatId)
    .select("-__v")
    .populate("participants", "username avatar")
    .populate({
      path: "lastMessage",
      populate: {
        path: "senderId",
        select: "username avatar",
      },
    });

  if (!chat) {
    throw new Error("Chat not found");
  }

  // If userId is provided, check if user is a participant
  if (userId && !isParticipant(chat, userId)) {
    throw new Error("Access denied: Not a participant");
  }

  return chat;
};

const createGroupChat = async (userId, name, participantIds) => {
  // Remove duplicates and ensure userId is included
  const uniqueParticipants = [
    ...new Set([userId.toString(), ...participantIds.map(String)]),
  ];

  if (uniqueParticipants.length < 3) {
    throw new Error("Group chat must have at least 3 participants");
  }

  const chat = await Chat.create({
    type: "group",
    name: name.trim(),
    participants: uniqueParticipants,
    admins: [userId],
    createdBy: userId,
  });

  return await Chat.findById(chat._id)
    .select("-__v")
    .populate("participants", "username avatar");
};

const addMembersToGroupChat = async (userId, chatId, newMemberIds) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (!isParticipant(chat, userId)) {
    throw new Error("Access denied: Not a participant");
  }
  if (isParticipant(chat, newMemberIds)) {
    throw new Error("Member already exists");
  }

  if (chat.type !== "group") {
    throw new Error("Not a group chat");
  }

  if (!isAdmin(chat, userId)) {
    throw new Error("Only admins can add members");
  }

  // Filter out existing participants
  const existingParticipants = chat.participants.map((p) => p.toString());
  const actualNewMembers = newMemberIds.filter(
    (id) => !existingParticipants.includes(id),
  );

  if (actualNewMembers.length === 0) {
    return getChatById(chatId, userId);
  }

  await Chat.findByIdAndUpdate(chatId, {
    $addToSet: {
      participants: {
        $each: actualNewMembers,
      },
    },
  });

  return getChatById(chatId, userId);
};

const removeMembersFromGroupChat = async (userId, chatId, memberIds) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (!isParticipant(chat, userId)) {
    throw new Error("Access denied: Not a participant");
  }

  if (chat.type !== "group") {
    throw new Error("Not a group chat");
  }

  if (!isAdmin(chat, userId)) {
    throw new Error("Only admins can remove members");
  }

  if (memberIds.includes(userId.toString())) {
    throw new Error(
      "Admins cannot remove themselves. Use leave group instead.",
    );
  }

  if (memberIds.some((id) => !isParticipant(chat, id))) {
    throw new Error("Member not found");
  }

  chat.participants = chat.participants.filter(
    (participantId) => !memberIds.includes(participantId.toString()),
  );

  chat.admins = chat.admins.filter(
    (adminId) => !memberIds.includes(adminId.toString()),
  );

  if (chat.participants.length < 2) {
    chat.isActive = false;
  }

  await chat.save();

  return chat;
};

const leaveGroupChat = async (userId, chatId) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (chat.type !== "group") {
    throw new Error("Not a group chat");
  }

  if (!isParticipant(chat, userId)) {
    throw new Error("Not a participant");
  }

  const isCreator = chat.createdBy.toString() === userId.toString();

  chat.participants = chat.participants.filter(
    (participant) => participant.toString() !== userId.toString(),
  );

  chat.admins = chat.admins.filter(
    (admin) => admin.toString() !== userId.toString(),
  );

  if (isCreator) {
    if (chat.participants.length > 0) {
      const newCreator = chat.admins[0] || chat.participants[0];

      chat.createdBy = newCreator;

      if (
        !chat.admins.some((admin) => admin.toString() === newCreator.toString())
      ) {
        chat.admins.push(newCreator);
      }
    }
  }

  if (chat.participants.length < 2) {
    chat.isActive = false;
  }

  await chat.save();

  return chat;
};

const updateGroupChat = async (userId, chatId, payload) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (!isParticipant(chat, userId)) {
    throw new Error("Access denied: Not a participant");
  }

  if (chat.type !== "group") {
    throw new Error("Not a group chat");
  }

  if (!isAdmin(chat, userId)) {
    throw new Error("Only admins can update group");
  }

  if (payload.name) {
    chat.name = payload.name;
  }

  if (payload.groupAvatar) {
    chat.groupAvatar = payload.groupAvatar;
  }

  await chat.save();

  return chat;
};

const assignAdminRole = async (userId, chatId, memberId) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (!isParticipant(chat, userId)) {
    throw new Error("Access denied: Not a participant");
  }

  if (!isAdmin(chat, userId)) {
    throw new Error("Only admins can assign admins");
  }

  if (isAdmin(chat, memberId)) {
    throw new Error("User is already an admin");
  }

  if (!isParticipant(chat, memberId)) {
    throw new Error("Member not found");
  }

  await Chat.findByIdAndUpdate(chatId, {
    $addToSet: {
      admins: memberId,
    },
  });

  return getChatById(chatId);
};

const revokeAdminRole = async (userId, chatId, memberId) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (!isParticipant(chat, userId)) {
    throw new Error("Access denied: Not a participant");
  }

  if (!isAdmin(chat, userId)) {
    throw new Error("Only admins can revoke admins");
  }

  if (memberId.toString() === userId.toString()) {
    throw new Error("Admins cannot revoke their own admin role");
  }

  if (chat.createdBy.toString() === memberId.toString()) {
    throw new Error("Cannot revoke admin role of the group creator");
  }

  if (!isAdmin(chat, memberId)) {
    throw new Error("User is not an admin");
  }

  chat.admins = chat.admins.filter(
    (adminId) => adminId.toString() !== memberId.toString(),
  );

  await chat.save();

  return chat;
};

const searchConversation = async (userId, query) => {
  if (!query?.trim()) {
    return [];
  }
  const users = await User.find({
    _id: { $ne: userId },
    $or: [
      { username: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  })
    .select("_id username avatar email")
    .limit(10);

  if (!users.length) {
    return [];
  }

  const userIds = users.map((u) => u._id);

  const chats = await Chat.find({
    type: "direct",
    $and: [{ participants: userId }, { participants: { $in: userIds } }],
  })
    .populate({
      path: "lastMessage",
      select: "content sender createdAt",
    })
    .select("_id participants lastMessage");

  const chatmap = new Map();

  chats.forEach((chat) => {
    const otherUser = chat.participants.find(
      (p) => p.toString() !== userId.toString(),
    );
    if (otherUser) {
      chatmap.set(otherUser.toString(), {
        chatId: chat._id,
        lastMessage: chat.lastMessage,
      });
    }
  });

  return users.map((user) => {
    const chatData = chatmap.get(user._id.toString());

    return {
      ...user.toObject(),
      chatExists: !!chatData,
      chatId: chatData?.chatId || null,
      lastMessage: chatData?.lastMessage || null,
    };
  });
};

const clearChat = async (userId, chatId) => {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error("chat not found");
  }

  if (!isParticipant(chat, userId)) {
    throw new Error("Access denied: Not a participant");
  }

  await Message.deleteMany({ chatId: chatId });

  await Chat.findByIdAndUpdate(chatId, {
    $set: {
      lastMessage: null,
    },
  });

  return getChatById(chatId, userId);
};

const deleteConversation = async (userId, chatId) => {
  const chat = await Chat.findById(chatId).populate(
    "participants",
    "username avatar",
  );
  if (!chat) {
    throw new Error("chat not found");
  }

  if (!isParticipant(chat, userId)) {
    throw new Error("Access denied: Not a participant");
  }
  await Message.deleteMany({ chatId: chatId });

  await Chat.findByIdAndDelete(chatId);

  return chat;
};

const getGroupChatInfo = async (userId, chatId) => {
  const chat = await Chat.findOne({ _id: chatId, type: "group" })
    .populate("participants", "username avatar email")
    .populate("admins", "username avatar email")
    .populate("createdBy", "username avatar email")
    .lean();

  if (!chat) {
    throw new Error("chat not found");
  }

  if (!isParticipant(chat, userId)) {
    throw new Error("Access denied: Not a participant");
  }

  const membersMap = new Map();
  [...chat.admins, ...chat.participants].forEach((user) => {
    membersMap.set(user._id.toString(), {
      ...user,
      isAdmin: chat.admins.some(
        (admin) => admin._id.toString() === user._id.toString(),
      ),
      isCreator: chat.createdBy._id.toString() === user._id.toString(),
    });
  });
  const currentUserInfo = membersMap.get(userId.toString());
  chat.isCurrentUserAdmin = currentUserInfo ? currentUserInfo.isAdmin : false;
  chat.isCurrentUserCreator = currentUserInfo ? currentUserInfo.isCreator : false;

  chat.members = [...membersMap.values()].filter(
    (member) => member._id.toString() !== userId.toString(),
  );
  delete chat.admins;
  delete chat.participants;
  return chat;
};

module.exports = {
  createDirectChat,
  createGroupChat,
  getUserChats,
  getChatById,
  addMembersToGroupChat,
  removeMembersFromGroupChat,
  leaveGroupChat,
  updateGroupChat,
  assignAdminRole,
  revokeAdminRole,
  searchConversation,
  clearChat,
  deleteConversation,
  getGroupChatInfo,
};
