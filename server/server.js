const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Deal = require('./models/Deal');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Express app
const app = express();

// Detailed CORS setup
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const dealAlertRoutes = require('./routes/dealAlerts');
const dealReportRoutes = require('./routes/dealReports');
const cacheMiddleware = require('./middleware/cache');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/alerts', dealAlertRoutes);
app.use('/api/reports', dealReportRoutes);

// Deals endpoint
app.get(
  '/api/deals',
  cacheMiddleware(() => 'all_deals'),
  async (req, res) => {
  try {
    console.log('Received request for deals');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB is not connected');
    }
    
    const deals = await Deal.find({ isActive: true }).sort('-createdAt');
    console.log(`Found ${deals.length} deals`);
    
    res.json(deals);
  } catch (error) {
    console.error('Error in /api/deals:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Error fetching deals',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const count = await Deal.countDocuments();
    res.json({ 
      status: 'ok',
      database: dbStatus,
      documentCount: count,
      mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deals_db'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      error: error.message
    });
  }
});

// Reset database endpoint
app.post('/api/reset', async (req, res) => {
  try {
    console.log('\n=== Starting database reset ===');
    
    console.log('Checking MongoDB connection...');
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB is not connected');
    }
    
    console.log('Dropping deals collection...');
    try {
      await mongoose.connection.collection('deals').drop();
      console.log('Collection dropped successfully');
    } catch (dropError) {
      if (dropError.code === 26) {
        console.log('Collection does not exist, proceeding...');
      } else {
        throw dropError;
      }
    }
    
    console.log('Starting scraper...');
    await Deal.scrapeDeals();
    console.log('Scraper completed');
    
    const count = await Deal.countDocuments();
    console.log(`Found ${count} deals in database`);
    
    console.log('=== Reset completed successfully ===\n');
    
    res.json({ 
      message: 'Database reset and repopulated successfully',
      dealsCount: count
    });
  } catch (error) {
    console.error('\n=== Reset failed ===');
    console.error('Error details:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('=== End error details ===\n');
    
    res.status(500).json({ 
      message: 'Error resetting database',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Trigger manual scraping endpoint
app.post('/api/scrape', async (req, res) => {
  try {
    console.log('Manual scraping triggered');
    await Deal.scrapeDeals();
    const count = await Deal.countDocuments();
    res.json({ 
      message: 'Scraping completed successfully',
      dealsCount: count
    });
  } catch (error) {
    console.error('Error during manual scraping:', error);
    res.status(500).json({ 
      message: 'Error during scraping',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Database management endpoints
app.get('/api/deals/count', async (req, res) => {
  try {
    const count = await Deal.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error counting deals' });
  }
});

app.get('/api/deals/retailer/:retailer', async (req, res) => {
  try {
    const deals = await Deal.find({ 
      retailer: new RegExp(req.params.retailer, 'i')
    });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deals by retailer' });
  }
});

app.post('/api/deals', async (req, res) => {
  try {
    const newDeal = new Deal(req.body);
    await newDeal.save();
    res.status(201).json(newDeal);
  } catch (error) {
    res.status(400).json({ message: 'Error creating deal', error: error.message });
  }
});

app.delete('/api/deals/:id', async (req, res) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting deal' });
  }
});

// Track deal views
app.post('/api/deals/:id/view', async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json({ views: deal.views });
  } catch (error) {
    res.status(500).json({ message: 'Error recording view' });
  }
});

// Get deals by category
app.get('/api/deals/category/:category', async (req, res) => {
  try {
    const deals = await Deal.find({ category: req.params.category })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deals by category', error: error.message });
  }
});

// Search deals by title or description
app.get('/api/deals/search', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const deals = await Deal.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Error searching deals', error: error.message });
  }
});

// Get deals by price range
app.get('/api/deals/price-range', async (req, res) => {
  try {
    const { min, max } = req.query;
    const query = {};
    
    if (min) query.price = { $gte: parseFloat(min) };
    if (max) query.price = { ...query.price, $lte: parseFloat(max) };
    
    const deals = await Deal.find(query)
      .sort({ price: 1 })
      .limit(50);
    
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deals by price range', error: error.message });
  }
});

// Get latest deals
app.get('/api/deals/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const deals = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest deals', error: error.message });
  }
});

// Get deals with advanced filtering
app.get('/api/deals/filter', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 50,
      page = 1
    } = req.query;

    // Build query
    const query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const deals = await Deal.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Deal.countDocuments(query);

    res.json({
      deals,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error filtering deals', error: error.message });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Schedule deals scraping every hour
const SCRAPE_INTERVAL = 60 * 60 * 1000; // 1 hour
setInterval(async () => {
  console.log('Starting scheduled deals scraping...');
  await Deal.scrapeDeals();
}, SCRAPE_INTERVAL);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server and cleaning up...');
  await Deal.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing HTTP server and cleaning up...');
  await Deal.close();
  process.exit(0);
});

console.log('Initializing server...');
connectDB()
  .then(() => {
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
      console.log(`Deals endpoint: http://localhost:${PORT}/api/deals`);
      console.log('MongoDB connection state:', mongoose.connection.readyState);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
