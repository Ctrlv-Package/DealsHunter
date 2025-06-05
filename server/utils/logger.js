const winston = require('winston');
// Pull in the main application configuration rather than the scraping
// configuration file located at server/config.js.
const config = require('../config/index');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, metadata }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(metadata.stack ? { error: metadata } : metadata)
    }, null, 2);
  })
);

// Define development format for console
const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    const metaStr = Object.keys(metadata).length ? 
      `\n${JSON.stringify(metadata, null, 2)}` : '';
    return `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || config.logging.level || 'info',
  levels: logLevels,
  format: logFormat,
  defaultMeta: { service: 'deals-hunter' },
  transports: [
    // Write all logs to console with custom format in development
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : developmentFormat
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Write all logs with level 'error' to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Write all HTTP logs to http.log
    new winston.transports.File({
      filename: path.join(logsDir, 'http.log'),
      level: 'http',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ],
  // Don't exit on handled exceptions
  exitOnError: false
});

// Add request logging middleware
logger.middleware = (req, res, next) => {
  // Don't log health check endpoints
  if (req.path === '/health' || req.path === '/ping') {
    return next();
  }

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl}`;
    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    if (res.statusCode >= 400) {
      logger.warn(message, meta);
    } else {
      logger.http(message, meta);
    }
  });

  next();
};

// Add error logging middleware
logger.errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  logger.error(message, {
    error: err,
    method: req.method,
    url: req.originalUrl,
    status,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  res.status(status).json({
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
      status
    }
  });
};

// Add stream for Morgan HTTP logger
logger.stream = {
  write: (message) => logger.http(message.trim())
};

module.exports = logger;
