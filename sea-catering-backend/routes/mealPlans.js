const express = require('express');
const { body, validationResult } = require('express-validator');
const MealPlan = require('../models/MealPlan');

const router = express.Router();

// Validation middleware for meal plan creation/update
const validateMealPlan = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Meal plan name must be at least 2 characters long'),
  
  body('price')
    .isNumeric()
    .custom(value => value >= 0)
    .withMessage('Price must be a positive number'),
  
  body('planType')
    .isIn(['diet', 'protein', 'royal'])
    .withMessage('Plan type must be diet, protein, or royal'),
  
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  
  body('detailedDescription')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Detailed description must be at least 20 characters long'),
  
  body('features')
    .isArray({ min: 1 })
    .withMessage('At least one feature must be provided'),
  
  body('nutritionInfo.calories')
    .trim()
    .notEmpty()
    .withMessage('Calories information is required'),
  
  body('nutritionInfo.protein')
    .trim()
    .notEmpty()
    .withMessage('Protein information is required'),
  
  body('nutritionInfo.carbs')
    .trim()
    .notEmpty()
    .withMessage('Carbs information is required'),
  
  body('nutritionInfo.fats')
    .trim()
    .notEmpty()
    .withMessage('Fats information is required')
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

// GET /api/meal-plans - Get all meal plans with optional filters
router.get('/', async (req, res) => {
  try {
    const {
      planType,
      minPrice,
      maxPrice,
      sortBy = 'planType',
      sortOrder = 'asc',
      active
    } = req.query;

    // Build filter object
    const filter = {};
    if (planType) filter.planType = planType;
    if (active !== undefined) filter.isActive = active === 'true';
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const mealPlans = await MealPlan.find(filter)
      .sort(sort)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: mealPlans.length,
      data: mealPlans
    });
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({
      error: 'Failed to fetch meal plans',
      message: error.message
    });
  }
});

// GET /api/meal-plans/:id - Get meal plan by ID
router.get('/:id', async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id).select('-__v');
    
    if (!mealPlan) {
      return res.status(404).json({
        error: 'Meal plan not found',
        message: `No meal plan found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: mealPlan
    });
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid meal plan ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to fetch meal plan',
      message: error.message
    });
  }
});

// GET /api/meal-plans/type/:planType - Get meal plans by type
router.get('/type/:planType', async (req, res) => {
  try {
    const { planType } = req.params;
    
    if (!['diet', 'protein', 'royal'].includes(planType)) {
      return res.status(400).json({
        error: 'Invalid plan type',
        message: 'Plan type must be diet, protein, or royal'
      });
    }

    const mealPlans = await MealPlan.find({ planType, isActive: true })
      .sort({ price: 1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: mealPlans.length,
      data: mealPlans
    });
  } catch (error) {
    console.error('Error fetching meal plans by type:', error);
    res.status(500).json({
      error: 'Failed to fetch meal plans',
      message: error.message
    });
  }
});

// POST /api/meal-plans - Create new meal plan
router.post('/', validateMealPlan, handleValidationErrors, async (req, res) => {
  try {
    const mealPlanData = {
      name: req.body.name,
      price: req.body.price,
      planType: req.body.planType,
      description: req.body.description,
      detailedDescription: req.body.detailedDescription,
      features: req.body.features,
      nutritionInfo: req.body.nutritionInfo,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const mealPlan = new MealPlan(mealPlanData);
    const savedMealPlan = await mealPlan.save();

    res.status(201).json({
      success: true,
      message: 'Meal plan created successfully',
      data: savedMealPlan
    });
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.status(500).json({
      error: 'Failed to create meal plan',
      message: error.message
    });
  }
});

// PUT /api/meal-plans/:id - Update meal plan
router.put('/:id', validateMealPlan, handleValidationErrors, async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      price: req.body.price,
      planType: req.body.planType,
      description: req.body.description,
      detailedDescription: req.body.detailedDescription,
      features: req.body.features,
      nutritionInfo: req.body.nutritionInfo,
      isActive: req.body.isActive
    };

    const mealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    ).select('-__v');

    if (!mealPlan) {
      return res.status(404).json({
        error: 'Meal plan not found',
        message: `No meal plan found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meal plan updated successfully',
      data: mealPlan
    });
  } catch (error) {
    console.error('Error updating meal plan:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid meal plan ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update meal plan',
      message: error.message
    });
  }
});

// PATCH /api/meal-plans/:id/status - Toggle meal plan active status
router.patch('/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'isActive must be a boolean value'
      });
    }

    const mealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!mealPlan) {
      return res.status(404).json({
        error: 'Meal plan not found',
        message: `No meal plan found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: `Meal plan ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: mealPlan
    });
  } catch (error) {
    console.error('Error updating meal plan status:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid meal plan ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to update meal plan status',
      message: error.message
    });
  }
});

// DELETE /api/meal-plans/:id - Delete meal plan
router.delete('/:id', async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndDelete(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({
        error: 'Meal plan not found',
        message: `No meal plan found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meal plan deleted successfully',
      data: mealPlan
    });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid meal plan ID',
        message: 'The provided ID is not a valid format'
      });
    }
    
    res.status(500).json({
      error: 'Failed to delete meal plan',
      message: error.message
    });
  }
});

// POST /api/meal-plans/seed - Seed default meal plans (development only)
router.post('/seed', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        error: 'Operation not allowed',
        message: 'Seeding is only allowed in development environment'
      });
    }

    // Clear existing meal plans
    await MealPlan.deleteMany({});

    const defaultMealPlans = [
      {
        name: 'Diet Plan',
        price: 30000,
        planType: 'diet',
        description: 'Healthy, balanced meals focused on weight management',
        detailedDescription: 'Our Diet Plan features carefully crafted meals with controlled portions and balanced nutrition. Perfect for those looking to maintain a healthy weight while enjoying delicious, satisfying meals.',
        features: [
          'Calorie-controlled portions',
          'High fiber content',
          'Low saturated fat',
          'Fresh vegetables and lean proteins',
          'Nutritionist approved'
        ],
        nutritionInfo: {
          calories: '400-500 per meal',
          protein: '25-30g',
          carbs: '40-50g',
          fats: '15-20g'
        }
      },
      {
        name: 'Protein Plan',
        price: 40000,
        planType: 'protein',
        description: 'High-protein meals perfect for fitness enthusiasts',
        detailedDescription: 'Our Protein Plan is designed for active individuals who need extra protein to support their fitness goals. Each meal is packed with high-quality proteins while maintaining great taste.',
        features: [
          'High protein content',
          'Lean meats and fish',
          'Post-workout friendly',
          'Muscle building support',
          'Balanced macronutrients'
        ],
        nutritionInfo: {
          calories: '500-600 per meal',
          protein: '40-45g',
          carbs: '35-45g',
          fats: '20-25g'
        }
      },
      {
        name: 'Royal Plan',
        price: 60000,
        planType: 'royal',
        description: 'Premium gourmet meals with finest ingredients',
        detailedDescription: 'Our Royal Plan offers the ultimate dining experience with premium ingredients and gourmet preparations. Indulge in restaurant-quality meals delivered to your door.',
        features: [
          'Premium ingredients',
          'Gourmet preparations',
          'Chef-crafted recipes',
          'Variety of cuisines',
          'Restaurant-quality taste'
        ],
        nutritionInfo: {
          calories: '600-700 per meal',
          protein: '30-40g',
          carbs: '50-60g',
          fats: '25-35g'
        }
      }
    ];

    const savedMealPlans = await MealPlan.insertMany(defaultMealPlans);

    res.status(201).json({
      success: true,
      message: 'Default meal plans seeded successfully',
      count: savedMealPlans.length,
      data: savedMealPlans
    });
  } catch (error) {
    console.error('Error seeding meal plans:', error);
    res.status(500).json({
      error: 'Failed to seed meal plans',
      message: error.message
    });
  }
});

module.exports = router;
