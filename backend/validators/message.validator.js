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
 * SEND MESSAGE
 */
const sendMessageSchema = z.object({
  body: z
    .object({
      chatId: objectIdSchema,

      content: z.string().trim().optional(),

      type: z
        .enum(["text", "image", "video", "file"])
        .optional()
        .default("text"),

      mediaUrl: z.string().url("Invalid media URL").optional(),
    })
    .refine(
      (data) => {
        if (data.type === "text" || !data.type) {
          return !!data.content?.trim();
        }

        return !!data.mediaUrl;
      },
      {
        message: "Content is required for text messages",
        path: ["content"],
      }
    ),
});

/**
 * GET MESSAGES
 */
const getMessagesSchema = z.object({
  query: z.object({
    chatId: objectIdSchema,

    page: z.coerce.number().int().positive().optional().default(1),

    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(100)
      .optional()
      .default(50),
  }),
});

/**
 * GET MESSAGE BY ID
 */
const getMessageByIdSchema = z.object({
  params: z.object({
    messageId: objectIdSchema,
  }),
});

/**
 * MARK MESSAGE AS READ
 */
const markAsReadSchema = z.object({
  params: z.object({
    messageId: objectIdSchema,
  }),
});

/**
 * EDIT MESSAGE
 */
const editMessageSchema = z.object({
  params: z.object({
    messageId: objectIdSchema,
  }),

  body: z.object({
    content: z
      .string({
        required_error: "Content is required",
      })
      .trim()
      .min(1, "Content cannot be empty")
      .max(5000, "Content cannot exceed 5000 characters"),
  }),
});

/**
 * DELETE MESSAGE
 */
const deleteMessageSchema = z.object({
  params: z.object({
    messageId: objectIdSchema,
  }),
});

/**
 * GET UNREAD COUNT
 */
const getUnreadCountSchema = z.object({
  query: z.object({
    chatId: objectIdSchema,
  }),
});

module.exports = {
  sendMessageSchema,
  getMessagesSchema,
  getMessageByIdSchema,
  markAsReadSchema,
  editMessageSchema,
  deleteMessageSchema,
  getUnreadCountSchema,
};