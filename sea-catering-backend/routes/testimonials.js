const express = require('express');
const { body, validationResult } = require('express-validator');
const Testimonial = require('../models/Testimonial');

const router = express.Router();

// Validation middleware for testimonial creation
const validateTestimonial = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  
  body('message')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('plan')
    .optional()
    .isIn(['diet', 'protein', 'royal'])
    .withMessage('Plan must be diet, protein, or royal'),
  
  body('location')
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

// GET /api/testimonials - Get all testimonials with optional filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      rating,
      plan,
      approved,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (rating) filter.rating = parseInt(rating);
    if (plan) filter.plan = plan;
    if (approved !== undefined) filter.isApproved = approved === 'true';

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const testimonials = await Testimonial.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    // Get total count for pagination info
    const total = await Testimonial.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: testimonials,
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
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      error: 'Failed to fetch testimonials',
      message: error.message
    });
  }
});

// GET /api/testimonials/approved - Get only approved testimonials (public endpoint)
router.get('/approved', async (req, res) => {
  try {
    const {
      limit = 10,
      rating,
      plan,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object - only approved testimonials
    const filter = { isApproved: true };
    if (rating) filter.rating = parseInt(rating);
    if (plan) filter.plan = plan;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const testimonials = await Testimonial.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching approved testimonials:', error);
    res.status(500).json({
      error: 'Failed to fetch testimonials',
      message: error.message
    });
  }
});

// GET /api/testimonials/:id - Get testimonial by ID
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id).select('-__v');
    
    if (!testimonial) {
      return res.status(404).json({
        error: 'Testimonial not found',
        message: `No testimonial found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid testimonial ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to fetch testimonial',
      message: error.message
    });
  }
});

// POST /api/testimonials - Create new testimonial
router.post('/', validateTestimonial, handleValidationErrors, async (req, res) => {
  try {
    const testimonialData = {
      name: req.body.name,
      message: req.body.message,
      rating: req.body.rating,
      plan: req.body.plan,
      location: req.body.location,
      // New testimonials are pending approval by default
      isApproved: false
    };

    const testimonial = new Testimonial(testimonialData);
    const savedTestimonial = await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully and is pending approval',
      data: savedTestimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      error: 'Failed to create testimonial',
      message: error.message
    });
  }
});

// PATCH /api/testimonials/:id/approve - Approve testimonial
router.patch('/:id/approve', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { 
        isApproved: true,
        approvedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!testimonial) {
      return res.status(404).json({
        error: 'Testimonial not found',
        message: `No testimonial found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial approved successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error approving testimonial:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid testimonial ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to approve testimonial',
      message: error.message
    });
  }
});

// PATCH /api/testimonials/:id/reject - Reject testimonial
router.patch('/:id/reject', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { 
        isApproved: false,
        approvedAt: null
      },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!testimonial) {
      return res.status(404).json({
        error: 'Testimonial not found',
        message: `No testimonial found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial rejected successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error rejecting testimonial:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid testimonial ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to reject testimonial',
      message: error.message
    });
  }
});

// PUT /api/testimonials/:id - Update testimonial
router.put('/:id', validateTestimonial, handleValidationErrors, async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      message: req.body.message,
      rating: req.body.rating,
      plan: req.body.plan,
      location: req.body.location
    };

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!testimonial) {
      return res.status(404).json({
        error: 'Testimonial not found',
        message: `No testimonial found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid testimonial ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update testimonial',
      message: error.message
    });
  }
});

// DELETE /api/testimonials/:id - Delete testimonial
router.delete('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        error: 'Testimonial not found',
        message: `No testimonial found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid testimonial ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to delete testimonial',
      message: error.message
    });
  }
});

// GET /api/testimonials/stats/overview - Get testimonial statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalTestimonials = await Testimonial.countDocuments();
    const approvedTestimonials = await Testimonial.countDocuments({ isApproved: true });
    const pendingTestimonials = await Testimonial.countDocuments({ isApproved: false });
    
    // Get rating distribution
    const ratingStats = await Testimonial.aggregate([
      { $match: { isApproved: true } },
      { $group: { 
          _id: '$rating', 
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    
    // Get average rating
    const avgRatingData = await Testimonial.aggregate([
      { $match: { isApproved: true } },
      { $group: { 
          _id: null, 
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    
    const averageRating = avgRatingData.length > 0 ? avgRatingData[0].averageRating : 0;

    // Get plan distribution
    const planStats = await Testimonial.aggregate([
      { $match: { isApproved: true, plan: { $exists: true } } },
      { $group: { 
          _id: '$plan', 
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTestimonials,
        approvedTestimonials,
        pendingTestimonials,
        averageRating: Math.round(averageRating * 100) / 100,
        ratingDistribution: ratingStats,
        planStatistics: planStats,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching testimonial statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch testimonial statistics',
      message: error.message
    });
  }
});

// POST /api/testimonials/seed - Seed default testimonials (development only)
router.post('/seed', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        error: 'Operation not allowed',
        message: 'Seeding is only allowed in development environment'
      });
    }

    // Clear existing testimonials
    await Testimonial.deleteMany({});

    const defaultTestimonials = [
      {
        name: 'Sarah Johnson',
        message: 'The Diet Plan has been amazing for my weight loss journey. The portions are perfect and the taste is incredible!',
        rating: 5,
        plan: 'diet',
        location: 'Jakarta',
        isApproved: true,
        approvedAt: new Date()
      },
      {
        name: 'Michael Chen',
        message: 'As a fitness enthusiast, the Protein Plan gives me exactly what I need. High quality meals that support my training.',
        rating: 5,
        plan: 'protein',
        location: 'Surabaya',
        isApproved: true,
        approvedAt: new Date()
      },
      {
        name: 'Priya Sharma',
        message: 'The Royal Plan is pure luxury! Every meal feels like dining at a 5-star restaurant. Worth every penny.',
        rating: 5,
        plan: 'royal',
        location: 'Bandung',
        isApproved: true,
        approvedAt: new Date()
      },
      {
        name: 'David Wilson',
        message: 'Great service and delicious meals. The Diet Plan has helped me maintain a healthy lifestyle effortlessly.',
        rating: 4,
        plan: 'diet',
        location: 'Medan',
        isApproved: true,
        approvedAt: new Date()
      },
      {
        name: 'Lisa Rodriguez',
        message: 'Love the variety in the Protein Plan. Perfect for my busy schedule and fitness goals.',
        rating: 5,
        plan: 'protein',
        location: 'Yogyakarta',
        isApproved: true,
        approvedAt: new Date()
      }
    ];

    const savedTestimonials = await Testimonial.insertMany(defaultTestimonials);

    res.status(201).json({
      success: true,
      message: 'Default testimonials seeded successfully',
      count: savedTestimonials.length,
      data: savedTestimonials
    });
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    res.status(500).json({
      error: 'Failed to seed testimonials',
      message: error.message
    });
  }
});

module.exports = router;
