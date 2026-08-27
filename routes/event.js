const express = require('express');
const router = express.Router();

// controllers
const {
  createevent,
  getevents,
  geteventbyid,
  updateevent,
  deleteevent,
} = require('../controllers/eventcontroller');

// auth middleware
const { requireauth, requirerole } = require('../middleware/auth');

// validation middleware & rules
const validate = require('../middleware/validate');
const { createeventrules, updateeventrules } = require('../middleware/validators');

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: List all events with optional filters, pagination, and sorting
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID filter
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully fetched events
 */
router.get('/', getevents);

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details with populated category
 *       404:
 *         description: Event not found
 */
router.get('/:id', geteventbyid);

/**
 * @openapi
 * /api/events:
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - city
 *               - capacity
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               city:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin role required)
 *       422:
 *         description: Validation error
 */
router.post(
  '/',
  requireauth,
  requirerole('admin'),
  validate(createeventrules),
  createevent
);

/**
 * @openapi
 * /api/events/{id}:
 *   patch:
 *     summary: Update an existing event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 */
router.patch(
  '/:id',
  requireauth,
  requirerole('admin'),
  validate(updateeventrules),
  updateevent
);

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 */
router.delete(
  '/:id',
  requireauth,
  requirerole('admin'),
  deleteevent
);

module.exports = router;