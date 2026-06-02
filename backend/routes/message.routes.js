const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const router = express.Router();
const messageController = require("../controller/message.controller");
router.use(authenticate);

// Message routes
router.post("/send", messageController.sendMessageController);
router.get("/", messageController.getMessagesController);
router.put("/:messageId/read", messageController.markAsReadController);
router.put("/:messageId", messageController.editMessageController);
router.delete("/:messageId", messageController.deleteMessageController);
router.get("/:messageId", messageController.getMessageByIdController);
router.get("/unread/count", messageController.getUnreadMessagesCountController);

module.exports = router;
