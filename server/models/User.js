const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  avatar: {
    type: String,
  },
  preferences: {
    emailNotifications: {
      dealAlerts: { type: Boolean, default: true },
      priceDrops: { type: Boolean, default: true },
      weeklyNewsletter: { type: Boolean, default: true },
      specialOffers: { type: Boolean, default: true },
      productRecommendations: { type: Boolean, default: true },
    },
    dealCategories: [{
      type: String,
      enum: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books', 'Toys', 'Other'],
    }],
    priceAlerts: [{
      productName: String,
      targetPrice: Number,
      active: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      lastTriggered: Date,
    }],
    displayCurrency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP'],
      default: 'USD',
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    dealFilters: {
      minDiscount: { type: Number, default: 0 },
      maxPrice: { type: Number },
      excludedBrands: [String],
      favoriteStores: [String],
      keywords: [String],
    },
    accessibility: {
      fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
      highContrast: { type: Boolean, default: false },
      reduceMotion: { type: Boolean, default: false },
    },
    privacy: {
      showProfile: { type: Boolean, default: true },
      shareDeals: { type: Boolean, default: true },
      allowRecommendations: { type: Boolean, default: true },
    }
  },
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    backupCodes: [String],
    lastPasswordChange: { type: Date, default: Date.now },
    passwordHistory: [{
      password: String,
      changedAt: { type: Date, default: Date.now }
    }],
    activeSessions: [{
      token: String,
      device: String,
      ip: String,
      lastActive: { type: Date, default: Date.now }
    }],
    loginAttempts: {
      count: { type: Number, default: 0 },
      lastAttempt: Date,
      lockedUntil: Date
    }
  },
  stats: {
    totalSaved: { type: Number, default: 0 },
    dealsViewed: { type: Number, default: 0 },
    dealsPurchased: { type: Number, default: 0 },
    lastLogin: Date,
    signupDate: { type: Date, default: Date.now },
    loginHistory: [{
      date: { type: Date, default: Date.now },
      ip: String,
      device: String,
      location: String
    }]
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  emailVerified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ 'preferences.dealCategories': 1 });
userSchema.index({ 'security.activeSessions.token': 1 });
userSchema.index({ resetPasswordToken: 1, resetPasswordExpires: 1 });

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Update timestamps
  this.updatedAt = new Date();

  // Hash password if modified
  if (this.isModified('password')) {
    // Store old password in history
    if (this.security.passwordHistory) {
      this.security.passwordHistory.push({
        password: this.password,
        changedAt: new Date()
      });
      
      // Keep only last 5 passwords
      if (this.security.passwordHistory.length > 5) {
        this.security.passwordHistory.shift();
      }
    }

    // Hash new password
    this.password = await bcrypt.hash(this.password, 10);
    this.security.lastPasswordChange = new Date();
  }

  next();
});

// Password validation
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if password was used before
userSchema.methods.isPasswordReused = async function(candidatePassword) {
  if (!this.security.passwordHistory) return false;

  for (const history of this.security.passwordHistory) {
    if (await bcrypt.compare(candidatePassword, history.password)) {
      return true;
    }
  }
  return false;
};

// Generate password reset token
userSchema.methods.generateResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  return token;
};

// Generate email verification token
userSchema.methods.generateVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  return token;
};

// Track login attempt
userSchema.methods.trackLoginAttempt = function(success, ip, device) {
  // Update login attempts
  if (!success) {
    this.security.loginAttempts.count += 1;
    this.security.loginAttempts.lastAttempt = new Date();
    
    // Lock account after 5 failed attempts
    if (this.security.loginAttempts.count >= 5) {
      this.security.loginAttempts.lockedUntil = new Date(Date.now() + 1800000); // 30 minutes
    }
  } else {
    // Reset on successful login
    this.security.loginAttempts.count = 0;
    this.security.loginAttempts.lockedUntil = undefined;
    
    // Update login history
    this.stats.lastLogin = new Date();
    this.stats.loginHistory.push({
      date: new Date(),
      ip,
      device
    });
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
