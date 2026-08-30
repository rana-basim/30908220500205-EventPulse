const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const apperror = require('./utils/apperror');
const errormiddleware = require('./middleware/errorhandler');
const connectDB = require('./config/db');

// Import routes
const userroutes = require('./routes/user');
const categoryroutes = require('./routes/category');
const eventroutes = require('./routes/event');
const registrationroutes = require('./routes/registration');
const messageroutes = require('./routes/message');

const app = express();

const path = require('path');

// CDN links to serve Swagger assets properly on Vercel
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
const JS_URL = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js"
];

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'EventPulse API',
      version: '1.0.0',
      description: 'EventPulse Management Backend API Documentation',
    },
    servers: [
      { url: '/' },
      { url: 'http://localhost:5000' }
    ],
  },
  // Crucial: Use path.join so Vercel resolves route paths in production
  apis: [path.join(__dirname, './routes/*.js')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// 1. Expose raw spec JSON endpoint
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// 2. Setup UI with explicit CDN options & JSON URL
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerUrl: '/api-docs-json',
    customCssUrl: CSS_URL,
    customJs: JS_URL
  })
);

// Global middleware
app.use(cors());
app.use(express.json());
// Database Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// API Routes
app.use('/api/users', userroutes);
app.use('/api/categories', categoryroutes);
app.use('/api/events', eventroutes);
app.use('/api/registrations', registrationroutes);
app.use('/api/messages', messageroutes);

// Task 7: Health Endpoint (confirms the server + the state of the database)

app.get('/health', async (req, res) => {
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
});

// Handle undefined routes
app.all(/(.*)/, (req, res, next) => {
  next(new apperror(`cannot find ${req.originalUrl} on this server`, 404));
});

// Task 6: Central Error Handling Middleware
app.use(errormiddleware);

module.exports = app;
