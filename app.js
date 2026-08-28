const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const apperror = require('./utils/apperror');
const errormiddleware = require('./middleware/errorhandler');

// Import routes
const userroutes = require('./routes/user');
const categoryroutes = require('./routes/category');
const eventroutes = require('./routes/event');
const registrationroutes = require('./routes/registration');
const messageroutes = require('./routes/message');

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'EventPulse API',
      version: '1.0.0',
      description: 'EventPulse Management Backend API Documentation',
    },
    servers: [
      { url: 'http://localhost:5000' }
    ],
  },
  apis: [], // Left empty to prevent Vercel file-system deployment crash
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Global middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', userroutes);
app.use('/api/categories', categoryroutes);
app.use('/api/events', eventroutes);
app.use('/api/registrations', registrationroutes);
app.use('/api/messages', messageroutes);

// Task 7: Health Endpoint (confirms the server + the state of the database)
app.get('/health', (req, res) => {
  const isdbconnected = mongoose.connection.readyState === 1;

  if (!isdbconnected) {
    return res.status(503).json({
      status: 'error',
      message: 'database connection not ready',
      database: 'disconnected',
    });
  }

  return res.status(200).json({
    status: 'ok',
    message: 'server and database operational',
    database: 'connected',
  });
});

// Handle undefined routes
app.all(/(.*)/, (req, res, next) => {
  next(new apperror(`cannot find ${req.originalUrl} on this server`, 404));
});

// Task 6: Central Error Handling Middleware
app.use(errormiddleware);

module.exports = app;
