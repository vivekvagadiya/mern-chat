const { 
  joinChatSchema, 
  newMessageSchema, 
  markReadSchema, 
  typingSchema 
} = require("../validators/socket.validator");

/**
 * Socket.io validation middleware
 * Validates incoming socket event data using Zod schemas
 */
const validateSocketEvent = (schema) => {
  return (socket, next) => {
    return async (data, callback) => {
      try {
        const validatedData = schema.parse(data);
        // Proceed with validated data
        return next(validatedData, callback);
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

/**
 * Pre-configured validation middleware for different events
 */
const socketValidators = {
  joinChat: validateSocketEvent(joinChatSchema),
  leaveChat: validateSocketEvent(joinChatSchema),
  newMessage: validateSocketEvent(newMessageSchema),
  markRead: validateSocketEvent(markReadSchema),
  typingStart: validateSocketEvent(typingSchema),
  typingStop: validateSocketEvent(typingSchema),
};

module.exports = { 
  validateSocketEvent, 
  socketValidators 
};
