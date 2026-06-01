const express = require("express");

const {
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
} = require("../controller/chat.controller");
const router = express.Router();
const validateSchema = require("../validators/schema.validator");
const {
  createDirectChatSchema,
  createGroupChatSchema,
  addMembersToGroupSchema,
  removeMembersFromGroupSchema,
  updateGroupChatSchema,
  assignAdminRoleSchema,
  revokeAdminRoleSchema,
  getChatByIdSchema,
  leaveGroupChatSchema,
} = require("../validators/chat.validator");
const authenticate = require("../middleware/auth.middleware");

router.use(authenticate);

router.post(
  "/create-direct-chat",
  validateSchema(createDirectChatSchema),
  createDirectChatController,
);
router.post(
  "/create-group-chat",
  validateSchema(createGroupChatSchema),
  createGroupChatController,
);
router.get("/get-user-chats", getUserChatsController);
router.get(
  "/get-chat-by-id/:chatId",
  validateSchema(getChatByIdSchema),
  getChatByIdController,
);
router.post(
  "/add-members-to-group-chat/:chatId",
  validateSchema(addMembersToGroupSchema),
  addMembersToGroupChatController,
);
router.post(
  "/remove-members-from-group/:chatId",
  validateSchema(removeMembersFromGroupSchema),
  removeMembersFromGroupController,
);
router.post(
  "/assign-admin-role/:chatId",
  validateSchema(assignAdminRoleSchema),
  assignAdminRoleController,
);
router.post(
  "/revoke-admin-role/:chatId",
  validateSchema(revokeAdminRoleSchema),
  revokeAdminRoleController,
);
router.post(
  "/leave-group-chat/:chatId",
  validateSchema(leaveGroupChatSchema),
  leaveGroupChatController,
);
router.put(
  "/update-group-chat/:chatId",
  validateSchema(updateGroupChatSchema),
  updateGroupChatController,
);

module.exports = router;
