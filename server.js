const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');
const initsocket = require('./services/socketservice');

// Resolve Environment Variables safely
const port = process.env.PORT || process.env.port || 5000;
const mongouri = process.env.MONGO_URI || process.env.mongo_uri;

// Prevent Vercel boot crashes
let isconnected = false;
const connectdb = async () => {
  if (isconnected && mongoose.connection.readyState === 1) return;
  if (!mongouri) {
    console.error('MONGO_URI is missing from Environment Variables!');
    return;
  }
  try {
    await mongoose.connect(mongouri);
    isconnected = true;
    console.log('mongodb connected successfully');
  } catch (error) {
    console.error('database connection failure:', error.message);
  }
};

// Middleware to ensure DB connection per request on serverless
app.use(async (req, res, next) => {
  await connectdb();
  next();
});

// VERCEL ENVIRONMENT: Export Express app directly (NO server.listen)
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // LOCAL ENVIRONMENT: Create HTTP Server & Socket.io
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  initsocket(io);

  connectdb().then(() => {
    server.listen(port, () => {
      console.log(`local server running on port ${port}`);
    });
  });
}
