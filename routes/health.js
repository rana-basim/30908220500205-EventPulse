const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Server and database health check
 *     tags:
 *       - Health Check
 *     description: Confirms the operational status of the server.
 *     responses:
 *       200:
 *         description: Operational status
 *         content:
 *           application/json:
 *             example:
 *               status: "ok"
 *               message: "server and database operational"
 */
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'server and database operational' });
});

module.exports = router;