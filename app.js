const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
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
const healthroutes = require('./routes/health');

const app = express();

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
  // Fix 1: Cross-platform slash normalization for Windows & Linux/Vercel
  apis: [path.join(__dirname, 'routes', '*.js').replace(/\\/g, '/')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// 1. Expose raw spec JSON endpoint
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

// 2. Setup UI with explicit CDN options
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    // Fix 2: Remove `swaggerUrl` to pass in-memory spec directly; add customCssUrl
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
app.use('/api/announcements', messageroutes);
app.use('/health', healthroutes);
app.use('/api/events', messageroutes);

// Handle undefined routes
app.all(/(.*)/, (req, res, next) => {
  next(new apperror(`cannot find ${req.originalUrl} on this server`, 404));
});

// Task 6: Central Error Handling Middleware
app.use(errormiddleware);

module.exports = app;