// 0. App Error
const AppError = require('../utils/apperror');

// 1. Async Handler Wrapper
const asyncHandler = require('../utils/asyncHandler');

// 2. Central Error Handler Middleware
const globalerrorhandler = (err, req, res, next) => {
  // Create mutable copies of status code and message
  let statusCode = err.statusCode || 500;
  let status = err.status || 'error';
  let message = err.message || 'Something went wrong';

  // --- Handle Specific Mongoose/MongoDB Errors ---

  // Mongoose Validation Error (e.g., missing required fields)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    status = 'fail';
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Mongoose Cast Error (e.g., passing an invalid MongoDB ObjectId string)
  if (err.name === 'CastError') {
    statusCode = 400;
    status = 'fail';
    message = `Invalid value for ObjectId`;
  }

  // MongoDB Duplicate Key Error (e.g., signing up with an email that already exists)
  if (err.code === 11000) {
    statusCode = 409;
    status = 'fail';
    // Dynamically grab the duplicate field name
    const fieldName = Object.keys(err.keyValue)[0];
    message = `Duplicate field value: "${err.keyValue[fieldName]}". Please use another value!`;
  }

  // --- Handle Auth / JWT Errors ---

  // Invalid / Tampered JWT Token
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    status = 'fail';
    message = 'Invalid token. Please log in again!';
  }

  // Expired JWT Token
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    status = 'fail';
    message = 'Your token has expired! Please log in again.';
  }

  // --- Send Response ---
  res.status(statusCode).json({
    status: status,
    message: message,
    // Only show the stack trace in development mode for security
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = globalerrorhandler;