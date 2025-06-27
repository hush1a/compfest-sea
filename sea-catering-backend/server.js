const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import security middleware
const { 
  sanitizeInput, 
  rateLimiters, 
  mongoSanitize, 
  securityHeaders,
  csrfProtection,
  setCSRFToken
} = require('./middleware/security');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const subscriptionRoutes = require('./routes/subscriptions');
const mealPlanRoutes = require('./routes/mealPlans');
const testimonialRoutes = require('./routes/testimonials');

// Initialize Express app
const app = express();

// Trust proxy headers for deployment platforms like Railway, Heroku, etc.
// This is required for rate limiting to work correctly behind proxies
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(securityHeaders);

// MongoDB injection prevention
app.use(mongoSanitize);

// Input sanitization (must be before body parsing)
app.use(sanitizeInput);

// Rate limiting - apply general rate limiting to all routes
app.use(rateLimiters.general);

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Cookie parsing middleware
app.use(cookieParser());

// CSRF token setup
app.use(setCSRFToken);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CSRF protection for state-changing operations
app.use(csrfProtection);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SEA Catering API is running - v2.0.1',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({
    csrfToken: req.cookies['csrf-token']
  });
});

// API routes with specific rate limiting
app.use('/api/auth', rateLimiters.auth, authRoutes);
app.use('/api/admin', rateLimiters.write, adminRoutes);
app.use('/api/subscriptions', rateLimiters.write, subscriptionRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SEA Catering API',
    version: '2.0.0',
    documentation: '/api/docs',
    endpoints: {
      authentication: '/api/auth',
      admin: '/api/admin',
      subscriptions: '/api/subscriptions',
      mealPlans: '/api/meal-plans',
      testimonials: '/api/testimonials',
      health: '/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: `${field} already exists`
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
