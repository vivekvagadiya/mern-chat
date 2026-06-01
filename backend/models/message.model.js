const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["text", "image", "file", "video", "audio", "sticker"],
      default: "text",
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index to efficiently query messages for a specific chat, sorted by creation time.
// This is crucial for fetching chat history.
messageSchema.index({ chatId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
