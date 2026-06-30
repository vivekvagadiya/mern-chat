const {
  addMembersToGroupChat,
  assignAdminRole,
  createDirectChat,
  createGroupChat,
  getChatById,
  getUserChats,
  leaveGroupChat,
  removeMembersFromGroupChat,
  revokeAdminRole,
  updateGroupChat,
  searchConversation,
  clearChat,
  deleteConversation,
} = require("../services/chat.service");

const apiResponse = require("../utils/apiResponse");

const createDirectChatController = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;
    const chat = await createDirectChat(userId, participantId);

    const io = req.app.get("io");
    const socketManager = require("../socket/roomManager");

    if (io) {
      // Notify both participants about the new chat
      const participants = [userId, participantId];

      participants.forEach((participantId) => {
        const userSocketId = socketManager.getUserSocketId(participantId);
        if (userSocketId) {
          io.to(userSocketId).emit("chat_created", chat);
        }
      });
    }

    return apiResponse.success(res, "Direct chat created successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const getUserChatsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await getUserChats(userId);

    return apiResponse.success(res, "Chats retrieved successfully", chats);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const getChatByIdController = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await getChatById(chatId, userId);
    return apiResponse.success(res, "Chat retrieved successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const createGroupChatController = async (req, res) => {
  try {
    const { name, participantIds } = req.body;
    const userId = req.user.id;
    const chat = await createGroupChat(userId, name, participantIds);
    const io = req.app.get("io");
    const socketManager = require("../socket/roomManager");

    if (io) {
      const participants = [userId, ...participantIds];
      participants.forEach((participantId) => {
        const userSocketId = socketManager.getUserSocketId(participantId);
        if (userSocketId) {
          io.to(userSocketId).emit("chat_created", chat);
        }
      });
    }
    return apiResponse.success(res, "Group chat created successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const addMembersToGroupChatController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { memberIds } = req.body;
    const chat = await addMembersToGroupChat(userId, chatId, memberIds);
    return apiResponse.success(res, "Members added successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const removeMembersFromGroupController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { memberIds } = req.body;
    const chat = await removeMembersFromGroupChat(userId, chatId, memberIds);
    return apiResponse.success(res, "Members removed successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const leaveGroupChatController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const chat = await leaveGroupChat(userId, chatId);
    return apiResponse.success(res, "Left group chat successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const updateGroupChatController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { name, groupAvatar } = req.body;
    const chat = await updateGroupChat(userId, chatId, { name, groupAvatar });
    return apiResponse.success(res, "Group chat updated successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const assignAdminRoleController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { memberId } = req.body;
    const chat = await assignAdminRole(userId, chatId, memberId);
    return apiResponse.success(res, "Admin role assigned successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const revokeAdminRoleController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { memberId } = req.body;
    const chat = await revokeAdminRole(userId, chatId, memberId);
    return apiResponse.success(res, "Admin role revoked successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const searchChatController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;
    const chats = await searchConversation(userId, query);
    return apiResponse.success(res, "Chats searched successfully", chats);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const clearChatController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const chat = await clearChat(userId, chatId);

    const io = req.app.get("io");
    const socketManager = require("../socket/roomManager");

    if (io) {
      const users = chat.participants;
      users.forEach((user) => {
        const userSocketId = socketManager.getUserSocketId(user._id.toString());

        if (userSocketId) {
          io.to(userSocketId).emit("chat_cleared", chat);
        }
      });
    }

    return apiResponse.success(res, "Chat cleared successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

const deleteChatController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const chat = await deleteConversation(userId, chatId);

    const io = req.app.get("io");
    const socketManager = require("../socket/roomManager");

    if (io) {
      const users = chat.participants;
      users.forEach((user) => {
        const userSocketId = socketManager.getUserSocketId(user._id.toString());

        if (userSocketId) {
          io.to(userSocketId).emit("chat_deleted", chat);
        }
      });
    }
    return apiResponse.success(res, "Chat deleted successfully", chat);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

module.exports = {
  addMembersToGroupChatController,
  assignAdminRoleController,
  createDirectChatController,
  createGroupChatController,
  getChatByIdController,
  getUserChatsController,
  leaveGroupChatController,
  removeMembersFromGroupController,
  revokeAdminRoleController,
  updateGroupChatController,
  searchChatController,
  clearChatController,
  deleteChatController,
};
