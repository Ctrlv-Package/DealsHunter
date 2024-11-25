const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true
  },
  originalPrice: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  productId: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Gaming', 'Appliances', 'Home & Garden', 'Fashion', 'Sports & Outdoors']
  },
  description: {
    type: String,
    default: ''
  },
  productUrl: {
    type: String,
    required: true
  },
  savings: {
    type: String,
    default: '0.00'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  retailer: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
dealSchema.index({ category: 1 });
dealSchema.index({ isActive: 1 });
dealSchema.index({ productId: 1 }, { unique: true });

const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;
