const express = require('express');
const router = express.Router();

// Controllers
const { register, login } = require('../controllers/usercontroller');

// Validation Middleware & Rules
const validate = require('../middleware/validate');
const { registerrules, loginrules } = require('../middleware/validators');

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [Users / Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [attendee, admin]
 *                 default: attendee
 *                 example: attendee
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       422:
 *         description: Validation error
 */
router.post('/register', validate(registerrules), register);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Authenticate user and return JWT token
 *     tags: [Users / Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully authenticated (returns JWT token)
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 */
router.post('/login', validate(loginrules), login);

module.exports = router;