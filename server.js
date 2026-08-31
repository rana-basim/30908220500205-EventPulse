const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');
const initsocket = require('./services/socketservice');

// Create HTTP server wrapping Express app
const server = http.createServer(app);

// Initialize Socket.io attached to HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

// Wire Socket.io event logic
initsocket(io);

// Database Connection & Server Startup
// Fixed: Check both UPPERCASE and lowercase env variables to prevent undefined errors
const port = process.env.PORT || process.env.port || 5000;
const mongouri = process.env.MONGO_URI || process.env.mongo_uri;

mongoose
  .connect(mongouri)
  .then(() => {
    console.log('mongodb atlas connected successfully');
    server.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('database connection failure:', error.message);
    process.exit(1);
  });
module.exports = app;
