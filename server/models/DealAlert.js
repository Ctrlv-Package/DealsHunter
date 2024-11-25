const mongoose = require('mongoose');

const dealAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  keywords: [{
    type: String,
    required: true,
    trim: true
  }],
  forum: {
    type: String,
    enum: ['Hot Deals', 'All Deals'],
    default: 'Hot Deals'
  },
  notificationMethods: [{
    type: String,
    enum: ['Email', 'Mobile Push Notification'],
    required: true
  }],
  frequency: {
    type: String,
    enum: ['Instant', 'Daily', 'Weekly'],
    default: 'Instant'
  },
  rating: {
    type: String,
    enum: ['Any', '1+', '2+', '3+', '4+', '5+', 'Popular', 'FP'],
    default: 'Any'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastNotified: {
    type: Date
  },
  matchCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
dealAlertSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to check if a deal matches this alert
dealAlertSchema.methods.matchesDeal = function(deal) {
  // Check if any keyword matches the deal title or description
  const matchesKeyword = this.keywords.some(keyword => {
    const regex = new RegExp(keyword, 'i');
    return regex.test(deal.title) || regex.test(deal.description);
  });

  // Add more sophisticated matching logic here
  // For example, check price ranges, categories, etc.

  return matchesKeyword;
};

const DealAlert = mongoose.model('DealAlert', dealAlertSchema);

module.exports = DealAlert;
