const connectDB = require('../config/db');

// @desc    Server and database health check
// @route   GET /health
// @access  Public
exports.getHealthStatus = async (req, res) => {
  try {
    // 1. Ensure DB connection promise is resolved
    const db = await connectDB();

    // 2. Ping the database directly to confirm active connection
    await db.connection.db.admin().ping();

    return res.status(200).json({
      status: 'ok',
      message: 'server and database operational',
      database: 'connected',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
      database: 'disconnected',
    });
  }
};