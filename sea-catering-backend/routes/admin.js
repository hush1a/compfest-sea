const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { requireAdmin, authenticate } = require('../middleware/auth');

const router = express.Router();

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please check your input data',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// GET /api/admin/users - Get all users (admin only)
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const users = await User.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-password -loginAttempts -lockUntil');

    // Get total count for pagination info
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// GET /api/admin/users/:id - Get user by ID (admin only)
router.get('/users/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -loginAttempts -lockUntil');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user found with ID: ${req.params.id}`
      });
    }

    // Get user's subscription count
    const subscriptionCount = await Subscription.countDocuments({ userId: user._id });

    res.status(200).json({
      success: true,
      data: {
        ...user.toJSON(),
        subscriptionCount
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

// PATCH /api/admin/users/:id/status - Update user status (admin only)
router.patch('/users/:id/status', authenticate, requireAdmin, [
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean value')
], handleValidationErrors, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update user status',
      message: error.message
    });
  }
});

// PATCH /api/admin/users/:id/role - Update user role (admin only)
router.patch('/users/:id/role', authenticate, requireAdmin, [
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
], handleValidationErrors, async (req, res) => {
  try {
    const { role } = req.body;
    
    // Prevent admin from demoting themselves
    if (req.params.id === req.user._id.toString() && role === 'user') {
      return res.status(400).json({
        error: 'Cannot demote yourself',
        message: 'You cannot change your own role from admin to user'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update user role',
      message: error.message
    });
  }
});

// DELETE /api/admin/users/:id - Delete user (admin only)
router.delete('/users/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        error: 'Cannot delete yourself',
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user found with ID: ${req.params.id}`
      });
    }

    // Also delete user's subscriptions
    await Subscription.deleteMany({ userId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'User and associated subscriptions deleted successfully',
      data: {
        deletedUser: user.email,
        deletedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to delete user',
      message: error.message
    });
  }
});

// GET /api/admin/stats - Get admin statistics
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    // Get user statistics
    const userStats = await User.getUserStatistics();
    
    // Get subscription statistics
    const subscriptionStats = await Subscription.getPlanStatistics();
    
    // Get total revenue
    const revenueData = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    
    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const recentSubscriptions = await Subscription.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    res.status(200).json({
      success: true,
      data: {
        users: userStats,
        subscriptions: {
          planStatistics: subscriptionStats,
          totalRevenue,
          recentSubscriptions
        },
        activity: {
          recentUsers,
          recentSubscriptions,
          period: 'Last 30 days'
        },
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// POST /api/admin/users - Create user (admin only)
router.post('/users', authenticate, requireAdmin, [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
], handleValidationErrors, async (req, res) => {
  try {
    const { fullName, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email address already exists'
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      role
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid user data',
        details: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    });
  }
});

module.exports = router;
