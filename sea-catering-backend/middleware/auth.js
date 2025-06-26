const User = require('../models/User');
const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');

/**
 * Middleware to authenticate users using JWT tokens
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No authentication token provided'
      });
    }

    // Verify the token
    const decoded = verifyToken(token);
    
    // Find the user in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User not found'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User account is deactivated'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        error: 'Account locked',
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Add user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.message === 'Token has expired') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Authentication token has expired. Please login again.'
      });
    } else if (error.message === 'Invalid token') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authentication token is invalid'
      });
    } else {
      return res.status(500).json({
        error: 'Authentication failed',
        message: 'An error occurred during authentication'
      });
    }
  }
};

/**
 * Middleware to authorize users based on roles
 * @param {string[]} allowedRoles - Array of allowed roles
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          error: 'Access denied',
          message: 'User not authenticated'
        });
      }

      // If no roles specified, allow any authenticated user
      if (allowedRoles.length === 0) {
        return next();
      }

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: 'Access forbidden',
          message: `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        error: 'Authorization failed',
        message: 'An error occurred during authorization'
      });
    }
  };
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = authorize(['admin']);

/**
 * Middleware to check if user can access their own resources or is admin
 * @param {string} userIdParam - Name of the parameter containing user ID
 */
const requireOwnershipOrAdmin = (userIdParam = 'userId') => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Access denied',
          message: 'User not authenticated'
        });
      }

      const resourceUserId = req.params[userIdParam] || req.body[userIdParam];
      const currentUserId = req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      // Allow access if user owns the resource or is admin
      if (resourceUserId === currentUserId || isAdmin) {
        return next();
      }

      return res.status(403).json({
        error: 'Access forbidden',
        message: 'You can only access your own resources'
      });
    } catch (error) {
      console.error('Ownership authorization error:', error);
      return res.status(500).json({
        error: 'Authorization failed',
        message: 'An error occurred during authorization'
      });
    }
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * Useful for endpoints that work for both authenticated and unauthenticated users
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return next(); // Continue without authentication
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    
    if (user && user.isActive && !user.isLocked) {
      req.user = user;
      req.token = token;
    }
    
    next();
  } catch (error) {
    // Silently continue without authentication for optional auth
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  requireAdmin,
  requireOwnershipOrAdmin,
  optionalAuthenticate
};
