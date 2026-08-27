const express = require('express');
const router = express.Router();
const { geteventmessages } = require('../controllers/messagecontroller');
const { requireauth } = require('../middleware/auth');

/**
 * @openapi
 * /api/messages/event/{eventid}:
 *   get:
 *     summary: Get message/announcement history for an event room
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventid
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID to retrieve message history for
 *     responses:
 *       200:
 *         description: Successfully fetched announcement history ordered by time
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       404:
 *         description: Event not found
 */
router.get('/event/:eventid', requireauth, geteventmessages);

module.exports = router;