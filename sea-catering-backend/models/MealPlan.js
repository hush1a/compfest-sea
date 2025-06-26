const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Meal plan name is required'],
    trim: true
  },
  
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  
  planType: {
    type: String,
    required: [true, 'Plan type is required'],
    enum: ['diet', 'protein', 'royal']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  
  detailedDescription: {
    type: String,
    required: [true, 'Detailed description is required'],
    trim: true
  },
  
  features: [{
    type: String,
    trim: true
  }],
  
  nutritionInfo: {
    calories: {
      type: String,
      required: true
    },
    protein: {
      type: String,
      required: true
    },
    carbs: {
      type: String,
      required: true
    },
    fats: {
      type: String,
      required: true
    }
  },
  
  sampleMeals: [{
    type: String,
    trim: true
  }],
  
  dietaryInfo: [{
    type: String,
    trim: true
  }],
  
  image: {
    type: String,
    default: '/api/placeholder/400/300'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Instance method to get formatted price
mealPlanSchema.methods.getFormattedPrice = function() {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(this.price);
};

// Static method to get plans by type
mealPlanSchema.statics.getByType = function(planType) {
  return this.find({ planType, isActive: true });
};

// Static method to get popular plans
mealPlanSchema.statics.getPopular = function(limit = 3) {
  return this.find({ isActive: true })
    .sort({ popularity: -1 })
    .limit(limit);
};

module.exports = mongoose.model('MealPlan', mealPlanSchema);
