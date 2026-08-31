const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireauth, requirerole } = require('../middleware/auth');
const { geteventmessages, createmessage } = require('../controllers/messagecontroller');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Event discussion and admin message endpoints
 */

/**
 * @swagger
 * /api/events/{eventid}/announcements:
 *   get:
 *     summary: Get all messages for a specific event
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventid
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event
 *     responses:
 *       200:
 *         description: List of event messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 65a123456789abcdef012345
 *                       content:
 *                         type: string
 *                         example: Welcome to the event!
 *                       event:
 *                         type: string
 *                         example: 65a987654321fedcba543210
 *                       sender:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                             example: system admin
 *                           email:
 *                             type: string
 *                             example: admin@eventpulse.com
 *                           role:
 *                             type: string
 *                             example: admin
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *   post:
 *     summary: Post a message to an event (Admin Only)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventid
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Please bring your IDs for registration at 9 AM.
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     content:
 *                       type: string
 *                     event:
 *                       type: string
 *                     sender:
 *                       type: object
 *       400:
 *         description: Bad Request - Missing required content
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Only admins can perform this action
 */

// All users can view messages

console.log('requireauth:', typeof requireauth);
console.log('geteventmessages:', typeof geteventmessages);
console.log('createmessage:', typeof createmessage);

router.get('/:eventid/announcements', requireauth, geteventmessages);
router.post('/:eventid/announcements', requireauth, createmessage);
router.post('/:eventid/announcements', requireauth, geteventmessages);

// ONLY Admins can post messages
router.post('/:eventid/announcements', requireauth, requirerole('admin'), createmessage);

module.exports = router;