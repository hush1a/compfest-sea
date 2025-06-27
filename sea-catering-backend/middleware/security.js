const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

// XSS Protection - HTML sanitization function
const sanitizeHtml = (text) => {
  if (typeof text !== 'string') return text;
  
  return text
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove on* event handlers
    .trim();
};

// Recursive sanitization for objects
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeHtml(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  return sanitized;
};

// Middleware to sanitize request body, query, and params
const sanitizeInput = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

// Enhanced rate limiting for different endpoints
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests',
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Trust proxy headers for platforms like Railway, Heroku, etc.
    trustProxy: true,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    }
  });
};

// Rate limiters for different endpoint types
const rateLimiters = {
  // General API rate limiting
  general: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many requests from this IP, please try again later.'
  ),
  
  // Stricter rate limiting for authentication endpoints
  auth: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 auth requests per windowMs
    'Too many authentication attempts, please try again later.'
  ),
  
  // Moderate rate limiting for data modification endpoints
  write: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    20, // limit each IP to 20 write requests per windowMs
    'Too many data modification requests, please try again later.'
  )
};

// MongoDB injection prevention
const mongoSanitizeConfig = {
  replaceWith: '_', // Replace prohibited characters with underscore
  allowDots: false, // Don't allow dots in keys
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized key: ${key} in request to ${req.path}`);
  }
};

// Security headers configuration
const securityHeaders = (req, res, next) => {
  // Additional security headers beyond helmet
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// CSRF Protection
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests and API endpoints that don't modify data
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method) || 
      req.path.includes('/api/meal-plans') && req.method === 'GET') {
    return next();
  }

  // For API requests, we'll use double-submit cookie pattern
  const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
  const csrfCookie = req.cookies['csrf-token'];

  if (!csrfToken || !csrfCookie || csrfToken !== csrfCookie) {
    return res.status(403).json({
      error: 'CSRF token validation failed',
      message: 'Invalid or missing CSRF token'
    });
  }

  next();
};

// Middleware to set CSRF token
const setCSRFToken = (req, res, next) => {
  if (!req.cookies['csrf-token']) {
    const token = generateCSRFToken();
    res.cookie('csrf-token', token, {
      httpOnly: false, // Need to be accessible by client-side JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
  }
  next();
};

module.exports = {
  sanitizeInput,
  sanitizeHtml,
  sanitizeObject,
  rateLimiters,
  mongoSanitizeConfig,
  mongoSanitize: mongoSanitize(mongoSanitizeConfig),
  securityHeaders,
  csrfProtection,
  setCSRFToken,
  generateCSRFToken
};
