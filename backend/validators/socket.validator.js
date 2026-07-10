const { z } = require("zod");
const mongoose = require("mongoose");

/**
 * OBJECT ID VALIDATION
 */
const objectIdSchema = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid ID",
  });

/**
 * JOIN CHAT
 */
const joinChatSchema = z.object({
  chatId: objectIdSchema,
});

/**
 * NEW MESSAGE
 */
const newMessageSchema = z
  .object({
    chatId: objectIdSchema,

    content: z.string().trim().max(500).optional(),

    type: z.enum(["text", "image", "file"]).optional().default("text"),

    mediaUrl: z.string().url("Invalid media URL").optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === "text") {
        return !!data.content?.trim();
      }

      return !!data.mediaUrl;
    },
    {
      message: "Content is required for text messages",
      path: ["content"],
    },
  );

/**
 * MARK MESSAGE AS READ
 */
const markReadSchema = z.object({
  messageId: objectIdSchema,
});

/**
 * TYPING EVENT
 */
const typingSchema = z.object({
  chatId: objectIdSchema,
});

const reactionSchema = z.object({
  messageId: objectIdSchema,
  emoji: z.string().min(1, "Emoji is required"),
});

module.exports = {
  joinChatSchema,
  newMessageSchema,
  markReadSchema,
  typingSchema,
  reactionSchema,
};
