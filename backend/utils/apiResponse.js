/**
 * API Response Utility
 * 
 * Concept: Standardized API response format
 * - Consistent success/error structure
 * - HTTP status codes
 * - Error details
 */
class ApiResponse {
  static success(res, message, data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }
  
  static error(res, message, statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }
  
  static validationError(res, errors) {
    return this.error(res, 'Validation failed', 400, errors);
  }
  
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }
  
  static unauthorized(res, message = 'Unauthorized') {
    return this.error(res, message, 401);
  }
  
  static forbidden(res, message = 'Forbidden') {
    return this.error(res, message, 403);
  }
}

module.exports = { apiResponse: ApiResponse };