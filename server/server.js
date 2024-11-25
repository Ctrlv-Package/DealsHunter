const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Deal = require('./models/Deal');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deals_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if cannot connect to MongoDB
});

// Enable mongoose debug mode
mongoose.set('debug', true);

// Auth routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Routes
app.get('/api/deals', async (req, res) => {
  try {
    console.log('Fetching deals from database...');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    console.log('Deal model:', typeof Deal);
    
    const deals = await Deal.find().sort('-createdAt');
    console.log(`Found ${deals.length} deals`);
    
    if (!deals || deals.length === 0) {
      console.log('No deals found in database');
      return res.status(404).json({ message: 'No deals found' });
    }
    
    res.json(deals);
  } catch (error) {
    console.error('Detailed error in /api/deals:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to fetch deals', 
      details: error.message,
      name: error.name
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

// Deals endpoint
app.get('/api/deals', async (req, res) => {
  try {
    console.log('Fetching deals from database...');
    const deals = await Deal.find({ isActive: true }).sort('-lastUpdated');
    console.log(`Found ${deals.length} deals`);
    res.json(deals);
  } catch (error) {
    console.error('Error in /api/deals:', error);
    res.status(500).json({ 
      message: 'Error fetching deals',
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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
