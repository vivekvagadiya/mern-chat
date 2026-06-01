const { ZodError } = require('zod');
const logger = require('../config/logger');
const {apiResponse} = require('../utils/apiResponse');

const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      if (!req.body) {
        return apiResponse.error(res, 'Request body is required', 400);
      }
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        logger.warn('Validation error', { errors, url: req.url });
        return apiResponse.error(res, 'Validation failed', 400, errors);
      }
      next(error);
    }
  };
};

module.exports = validateSchema;