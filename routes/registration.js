const express = require('express');
const router = express.Router();
const {
  registerforevent,
  getmyregistrations,
  cancelregistration,
} = require('../controllers/registrationcontroller');
const { requireauth } = require('../middleware/auth');

router.use(requireauth); // Enforces auth for all registration actions

/**
 * @openapi
 * /api/registrations:
 *   post:
 *     summary: Register authenticated user for an event
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: The MongoDB ObjectId of the target event
 *                 example: 65f1a2b3c4d5e6f7a8b9c0d1
 *     responses:
 *       201:
 *         description: Successfully registered for the event
 *       400:
 *         description: Event capacity reached or duplicate registration
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       404:
 *         description: Event not found
 */
router.post('/', registerforevent);

/**
 * @openapi
 * /api/registrations/my:
 *   get:
 *     summary: Get all event registrations for the logged-in user
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of current user's registrations with populated event data
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 */
router.get('/my', getmyregistrations);

/**
 * @openapi
 * /api/registrations/{id}:
 *   delete:
 *     summary: Cancel a registration and free event capacity
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration Record ID
 *     responses:
 *       200:
 *         description: Registration cancelled successfully
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User cannot cancel another user's registration)
 *       404:
 *         description: Registration record not found
 */
router.delete('/:id', cancelregistration);

module.exports = router;