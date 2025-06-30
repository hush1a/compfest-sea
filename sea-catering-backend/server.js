const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/database');

const { 
  sanitizeInput, 
  rateLimiters, 
  mongoSanitize, 
  securityHeaders,
  csrfProtection,
  setCSRFToken
} = require('./middleware/security');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const subscriptionRoutes = require('./routes/subscriptions');
const mealPlanRoutes = require('./routes/mealPlans');
const testimonialRoutes = require('./routes/testimonials');

const app = express();

app.set('trust proxy', 1);

connectDB();

app.use(helmet());
app.use(securityHeaders);
app.use(mongoSanitize);
app.use(sanitizeInput);
app.use(rateLimiters.general);

const corsOptions = {
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(setCSRFToken);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(csrfProtection);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SEA Catering API is running - v2.0.1',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/csrf-token', (req, res) => {
  res.json({
    csrfToken: req.cookies['csrf-token']
  });
});

app.use('/api/auth', rateLimiters.auth, authRoutes);
app.use('/api/admin', rateLimiters.write, adminRoutes);
app.use('/api/subscriptions', rateLimiters.write, subscriptionRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/testimonials', testimonialRoutes);

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

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
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
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: `${field} already exists`
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
