const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

const sanitizeHtml = (text) => {
  if (typeof text !== 'string') return text;
  
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

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

const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

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
    trustProxy: true,
    skip: (req) => {
      return req.path === '/health';
    }
  });
};

const rateLimiters = {
  general: createRateLimiter(
    15 * 60 * 1000,
    100,
    'Too many requests from this IP, please try again later.'
  ),
  
  auth: createRateLimiter(
    15 * 60 * 1000,
    5,
    'Too many authentication attempts, please try again later.'
  ),
  
  write: createRateLimiter(
    15 * 60 * 1000,
    20,
    'Too many data modification requests, please try again later.'
  )
};

const mongoSanitizeConfig = {
  replaceWith: '_',
  allowDots: false,
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized key: ${key} in request to ${req.path}`);
  }
};

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const csrfProtection = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method) || 
      req.path.includes('/api/meal-plans') && req.method === 'GET') {
    return next();
  }

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

const setCSRFToken = (req, res, next) => {
  if (!req.cookies['csrf-token']) {
    const token = generateCSRFToken();
    res.cookie('csrf-token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
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
