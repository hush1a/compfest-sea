const jwt = require('jsonwebtoken');

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

/**
 * Generate access and refresh tokens for a user
 * @param {Object} user - User object
 * @returns {Object} - Object containing access and refresh tokens
 */
const generateTokens = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    fullName: user.fullName
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'sea-catering',
    audience: 'sea-catering-users'
  });

  const refreshToken = jwt.sign(
    { userId: user._id, type: 'refresh' },
    JWT_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'sea-catering',
      audience: 'sea-catering-users'
    }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRES_IN
  };
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'sea-catering',
      audience: 'sea-catering-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Generate a password reset token
 * @param {Object} user - User object
 * @returns {string} - Password reset token
 */
const generatePasswordResetToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      type: 'password-reset',
      timestamp: Date.now()
    },
    JWT_SECRET,
    {
      expiresIn: '1h', // Password reset tokens expire in 1 hour
      issuer: 'sea-catering',
      audience: 'sea-catering-password-reset'
    }
  );
};

/**
 * Verify password reset token
 * @param {string} token - Password reset token
 * @returns {Object} - Decoded token payload
 */
const verifyPasswordResetToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'sea-catering',
      audience: 'sea-catering-password-reset'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Password reset token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid password reset token');
    } else {
      throw new Error('Password reset token verification failed');
    }
  }
};

module.exports = {
  generateTokens,
  verifyToken,
  extractTokenFromHeader,
  generatePasswordResetToken,
  verifyPasswordResetToken
};
