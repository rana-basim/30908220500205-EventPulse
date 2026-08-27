const { body, param } = require('express-validator');

// Auth Validators
const registerrules = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('a valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
];

const loginrules = [
  body('email').isEmail().withMessage('a valid email is required'),
  body('password').notEmpty().withMessage('password is required'),
];

// Event Validators
const createeventrules = [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('description').trim().notEmpty().withMessage('description is required'),
  body('date').isISO8601().withMessage('valid ISO date is required'),
  body('city').trim().notEmpty().withMessage('city is required'),
  body('capacity').isInt({ min: 1 }).withMessage('capacity must be a positive integer'),
  body('category').isMongoId().withMessage('valid category id is required'),
];

const updateeventrules = [
  body('title').optional().trim().notEmpty().withMessage('title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('description cannot be empty'),
  body('date').optional().isISO8601().withMessage('valid ISO date is required'),
  body('city').optional().trim().notEmpty().withMessage('city cannot be empty'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('capacity must be a positive integer'),
  body('category').optional().isMongoId().withMessage('valid category id is required'),
];

// Category Validators (FIXED: Changed categoryname -> name to match your Mongoose Schema)
const categoryrules = [
  body('name').trim().notEmpty().withMessage('category name is required'),
  body('description').optional().trim(),
];

// Registration Validators (FIXED: Accepts eventId in body or param)
const registrationrules = [
  body('eventId').optional().isMongoId().withMessage('valid event id is required'),
  param('eventId').optional().isMongoId().withMessage('valid event id is required'),
];

module.exports = {
  registerrules,
  loginrules,
  createeventrules,
  updateeventrules,
  categoryrules,
  registrationrules,
};