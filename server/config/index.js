require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/deals-aggregator',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '7d',
  
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'Deals Aggregator <noreply@dealsaggregator.com>'
  },

  security: {
    bcryptSaltRounds: 10,
    passwordResetExpires: 3600000, // 1 hour
    maxLoginAttempts: 5,
    lockoutDuration: 1800000, // 30 minutes
    sessionDuration: 604800000, // 7 days
    requireEmailVerification: true,
    allowedOrigins: [
      'http://localhost:3000',
      'https://dealsaggregator.com'
    ]
  },

  notifications: {
    dealAlertBatchSize: 10,
    weeklyNewsletterDay: 1, // Monday
    weeklyNewsletterTime: '09:00',
    priceDropThreshold: 10, // percentage
    dealExpiryWarning: 24 // hours
  },

  pagination: {
    defaultLimit: 10,
    maxLimit: 50
  },

  cache: {
    ttl: 3600, // 1 hour
    checkPeriod: 600 // 10 minutes
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'app.log'
  }
};

module.exports = config;
