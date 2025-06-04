const mongoose = require('mongoose');

const dealReportSchema = new mongoose.Schema({
  dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['expired', 'price', 'other'], required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DealReport', dealReportSchema);
