const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number'
    }
  },
  
  // Optional customer information
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  // Approval status for moderation
  isApproved: {
    type: Boolean,
    default: false
  },
  
  // Featured testimonials
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Subscription plan they used (optional)
  plan: {
    type: String,
    enum: ['diet', 'protein', 'royal'],
  },
  
  // Customer location (optional)
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  
  // Approval timestamp
  approvedAt: {
    type: Date
  },
  
  // Admin notes
  adminNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
testimonialSchema.index({ isApproved: 1, rating: -1 });
testimonialSchema.index({ isFeatured: 1 });

// Static method to get approved testimonials
testimonialSchema.statics.getApproved = function(limit = 10) {
  return this.find({ isApproved: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get featured testimonials
testimonialSchema.statics.getFeatured = function() {
  return this.find({ 
    isApproved: true, 
    isFeatured: true 
  })
  .sort({ rating: -1, createdAt: -1 });
};

// Static method to get testimonials by rating
testimonialSchema.statics.getByRating = function(rating) {
  return this.find({ 
    isApproved: true, 
    rating: rating 
  })
  .sort({ createdAt: -1 });
};

// Static method to get average rating
testimonialSchema.statics.getAverageRating = async function() {
  const result = await this.aggregate([
    { $match: { isApproved: true } },
    { $group: { 
        _id: null, 
        averageRating: { $avg: '$rating' },
        totalCount: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : { averageRating: 0, totalCount: 0 };
};

// Instance method to get star display
testimonialSchema.methods.getStarDisplay = function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
};

module.exports = mongoose.model('Testimonial', testimonialSchema);
