const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+62|62|0)[0-9]{9,13}$/, 'Please enter a valid Indonesian phone number']
  },
  
  // Plan Details
  plan: {
    type: String,
    required: [true, 'Plan selection is required'],
    enum: ['diet', 'protein', 'royal']
  },
  
  // Meal Types (at least one required)
  mealTypes: [{
    type: String,
    enum: ['breakfast', 'lunch', 'dinner']
  }],
  
  // Delivery Days (at least one required)
  deliveryDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  
  // Optional Information
  allergies: {
    type: String,
    trim: true
  },
  
  // Calculated Pricing
  totalPrice: {
    type: Number,
    default: 0
  },
  
  // Subscription Status
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active'
  },
  
  // Subscription Dates
  startDate: {
    type: Date,
    default: Date.now
  },
  
  endDate: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Validation: At least one meal type must be selected
subscriptionSchema.path('mealTypes').validate(function(value) {
  return value && value.length > 0;
}, 'At least one meal type must be selected');

// Validation: At least one delivery day must be selected
subscriptionSchema.path('deliveryDays').validate(function(value) {
  return value && value.length > 0;
}, 'At least one delivery day must be selected');

// Pre-save middleware to calculate total price
subscriptionSchema.pre('save', function(next) {
  const planPrices = {
    diet: 30000,
    protein: 40000,
    royal: 60000
  };
  
  if (this.plan && this.mealTypes && this.deliveryDays && 
      this.mealTypes.length > 0 && this.deliveryDays.length > 0) {
    const planPrice = planPrices[this.plan];
    const mealTypesCount = this.mealTypes.length;
    const deliveryDaysCount = this.deliveryDays.length;
    const multiplier = 4.3; // Monthly multiplier (approximately 4.3 weeks in a month)
    
    this.totalPrice = Math.round(planPrice * mealTypesCount * deliveryDaysCount * multiplier);
  } else {
    this.totalPrice = 0;
  }
  
  next();
});

// Instance method to get formatted price
subscriptionSchema.methods.getFormattedPrice = function() {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2
  }).format(this.totalPrice);
};

// Static method to get plan statistics
subscriptionSchema.statics.getPlanStatistics = async function() {
  return await this.aggregate([
    { $group: { 
        _id: '$plan', 
        count: { $sum: 1 },
        averagePrice: { $avg: '$totalPrice' }
      }
    }
  ]);
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
