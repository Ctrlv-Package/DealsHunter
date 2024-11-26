const mongoose = require('mongoose');
const alertService = require('../services/alertService');

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
  subcategory: {
    type: String,
    required: true
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

// Middleware to process alerts after saving a new deal
dealSchema.post('save', async function(doc) {
  if (this.isNew) {
    try {
      await alertService.processNewDeals([doc]);
    } catch (error) {
      console.error('Error processing alerts for new deal:', error);
    }
  }
});

// Middleware to process alerts after saving multiple deals
dealSchema.post('insertMany', async function(docs) {
  try {
    await alertService.processNewDeals(docs);
  } catch (error) {
    console.error('Error processing alerts for new deals:', error);
  }
});

const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;
