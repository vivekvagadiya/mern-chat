const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 50,
      // Name is required only for group chats
      required: function () {
        return this.type === "group";
      },
    },
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      required: true,
      validate: [
        (val) => val.length >= 2,
        "A chat must have at least 2 participants.",
      ],
    },
    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    groupAvatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Add an index on participants for faster queries to find chats for a user
chatSchema.index({ participants: 1 });

module.exports = mongoose.model("Chat", chatSchema);
