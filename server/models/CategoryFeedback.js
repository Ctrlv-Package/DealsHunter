const mongoose = require('mongoose');

const categoryFeedbackSchema = new mongoose.Schema({
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: true
  },
  originalCategory: {
    type: String,
    required: true
  },
  suggestedCategory: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
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

// Index for efficient querying
categoryFeedbackSchema.index({ dealId: 1, status: 1 });
categoryFeedbackSchema.index({ userId: 1, createdAt: -1 });

// Update the updatedAt timestamp on save
categoryFeedbackSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get pending feedback for review
categoryFeedbackSchema.statics.getPendingFeedback = function(limit = 10) {
  return this.find({ status: 'pending' })
    .sort({ confidence: -1 })
    .limit(limit)
    .populate('dealId')
    .populate('userId', 'username email');
};

// Static method to approve feedback and update classifier
categoryFeedbackSchema.statics.approveFeedback = async function(feedbackId) {
  const feedback = await this.findById(feedbackId);
  if (!feedback) {
    throw new Error('Feedback not found');
  }

  feedback.status = 'approved';
  await feedback.save();

  // Here you would typically update your classifier
  // This is just a placeholder - implement the actual classifier update logic
  return feedback;
};

const CategoryFeedback = mongoose.model('CategoryFeedback', categoryFeedbackSchema);

module.exports = CategoryFeedback;
