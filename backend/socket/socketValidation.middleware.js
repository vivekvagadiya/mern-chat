const { 
  joinChatSchema, 
  newMessageSchema, 
  markReadSchema, 
  typingSchema,
  reactionSchema
} = require("../validators/socket.validator");

/**
 * Socket.io validation middleware
 * Validates incoming socket event data using Zod schemas
 */
const validateSocketEvent = (schema) => {
  return (socket) => {
    return (handler) => {
      return async (data, callback) => {
        try {
          const validatedData = schema.parse(data);
          // Proceed with validated data
          return await handler(validatedData, callback);
        } catch (error) {
          if (error.name === 'ZodError') {
            socket.emit("validation_error", { 
              message: "Validation failed", 
              errors: error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message
              }))
            });
          } else {
            socket.emit("error", { message: error.message });
          }
        }
      };
    };
  };
};

/**
 * Factory function to create validators for a specific socket
 */
const createSocketValidators = (socket) => ({
  joinChat: validateSocketEvent(joinChatSchema)(socket),
  leaveChat: validateSocketEvent(joinChatSchema)(socket),
  newMessage: validateSocketEvent(newMessageSchema)(socket),
  markRead: validateSocketEvent(markReadSchema)(socket),
  typingStart: validateSocketEvent(typingSchema)(socket),
  typingStop: validateSocketEvent(typingSchema)(socket),
  addReaction: validateSocketEvent(reactionSchema)(socket),
});

module.exports = { 
  validateSocketEvent, 
  createSocketValidators 
};
