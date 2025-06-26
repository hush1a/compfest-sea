const express = require('express');
const { body, validationResult } = require('express-validator');
const Subscription = require('../models/Subscription');

const router = express.Router();

// Validation middleware for subscription creation
const validateSubscription = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  
  body('phone')
    .matches(/^(\+62|62|0)[0-9]{9,13}$/)
    .withMessage('Please enter a valid Indonesian phone number'),
  
  body('plan')
    .isIn(['diet', 'protein', 'royal'])
    .withMessage('Plan must be diet, protein, or royal'),
  
  body('mealTypes')
    .isArray({ min: 1 })
    .withMessage('At least one meal type must be selected')
    .custom((value) => {
      const validMealTypes = ['breakfast', 'lunch', 'dinner'];
      return value.every(meal => validMealTypes.includes(meal));
    })
    .withMessage('Invalid meal type selected'),
  
  body('deliveryDays')
    .isArray({ min: 1 })
    .withMessage('At least one delivery day must be selected')
    .custom((value) => {
      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      return value.every(day => validDays.includes(day));
    })
    .withMessage('Invalid delivery day selected'),
  
  body('allergies')
    .optional()
    .trim()
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// GET /api/subscriptions - Get all subscriptions with optional filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      plan,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (plan) filter.plan = plan;
    if (status) filter.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const subscriptions = await Subscription.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v'); // Exclude version field

    // Get total count for pagination info
    const total = await Subscription.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: subscriptions,
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
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      error: 'Failed to fetch subscriptions',
      message: error.message
    });
  }
});

// GET /api/subscriptions/:id - Get subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).select('-__v');
    
    if (!subscription) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: `No subscription found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid subscription ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to fetch subscription',
      message: error.message
    });
  }
});

// POST /api/subscriptions - Create new subscription
router.post('/', validateSubscription, handleValidationErrors, async (req, res) => {
  try {
    const subscriptionData = {
      name: req.body.name,
      phone: req.body.phone,
      plan: req.body.plan,
      mealTypes: req.body.mealTypes,
      deliveryDays: req.body.deliveryDays,
      allergies: req.body.allergies || ''
    };

    // Create new subscription (totalPrice will be calculated by pre-save middleware)
    const subscription = new Subscription(subscriptionData);
    const savedSubscription = await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: savedSubscription,
      formattedPrice: savedSubscription.getFormattedPrice()
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      error: 'Failed to create subscription',
      message: error.message
    });
  }
});

// PUT /api/subscriptions/:id - Update subscription
router.put('/:id', validateSubscription, handleValidationErrors, async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      phone: req.body.phone,
      plan: req.body.plan,
      mealTypes: req.body.mealTypes,
      deliveryDays: req.body.deliveryDays,
      allergies: req.body.allergies || ''
    };

    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    ).select('-__v');

    if (!subscription) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: `No subscription found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription,
      formattedPrice: subscription.getFormattedPrice()
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid subscription ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update subscription',
      message: error.message
    });
  }
});

// PATCH /api/subscriptions/:id/status - Update subscription status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['active', 'paused', 'cancelled'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be active, paused, or cancelled'
      });
    }

    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!subscription) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: `No subscription found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: `Subscription status updated to ${status}`,
      data: subscription
    });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid subscription ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update subscription status',
      message: error.message
    });
  }
});

// DELETE /api/subscriptions/:id - Delete subscription
router.delete('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: `No subscription found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid subscription ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to delete subscription',
      message: error.message
    });
  }
});

// GET /api/subscriptions/stats/overview - Get subscription statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const planStats = await Subscription.getPlanStatistics();
    
    // Calculate total revenue
    const revenueData = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalSubscriptions,
        activeSubscriptions,
        totalRevenue,
        planStatistics: planStats,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching subscription statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch subscription statistics',
      message: error.message
    });
  }
});

module.exports = router;
