const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Deal = require('../models/Deal');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dealshunter';
const DEALS_PER_SUBCATEGORY = 30; // This will generate ~1080 deals total (30 * 36 subcategories)
const BATCH_SIZE = 100; // Increased batch size for better performance

const retailers = [
  'Amazon', 'Best Buy', 'Walmart', 'Target', 'eBay',
  'Newegg', 'B&H Photo', 'Costco', 'Home Depot', 'Lowes'
];

const categoryGroups = {
  'Electronics': [
    'Smartphones',
    'Laptops',
    'TVs',
    'Audio',
    'Cameras',
    'Accessories'
  ],
  'Gaming': [
    'Consoles',
    'Video Games',
    'Gaming PCs',
    'Accessories',
    'VR',
    'Gaming Chairs'
  ],
  'Appliances': [
    'Kitchen',
    'Laundry',
    'Refrigerators',
    'Dishwashers',
    'Air Conditioners',
    'Vacuums'
  ],
  'Home & Garden': [
    'Furniture',
    'Decor',
    'Kitchen',
    'Bedding',
    'Garden Tools',
    'Lighting'
  ],
  'Fashion': [
    'Men\'s Clothing',
    'Women\'s Clothing',
    'Shoes',
    'Accessories',
    'Jewelry',
    'Watches'
  ],
  'Sports & Outdoors': [
    'Exercise Equipment',
    'Outdoor Recreation',
    'Sports Gear',
    'Camping',
    'Fishing',
    'Cycling'
  ]
};

// Category-specific product images
const categoryImages = {
  'Electronics': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&w=500&q=80', // Laptop
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&w=500&q=80', // Smart Watch
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&w=500&q=80', // Headphones
    'https://images.unsplash.com/photo-1511707171634-d851c5c3a47b?auto=format&w=500&q=80', // Mobile Phone
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&w=500&q=80', // Tablet
  ],
  'Gaming': [
    'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&w=500&q=80', // PS5
    'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?auto=format&w=500&q=80', // Xbox
    'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&w=500&q=80', // Nintendo Switch
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&w=500&q=80', // Gaming Keyboard
    'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&w=500&q=80', // Gaming Mouse
  ],
  'Appliances': [
    'https://images.unsplash.com/photo-1584269600519-112d071b35e9?auto=format&w=500&q=80', // Refrigerator
    'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&w=500&q=80', // Washing Machine
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&w=500&q=80', // Coffee Maker
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&w=500&q=80', // Microwave
    'https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&w=500&q=80', // Blender
  ],
  'Home & Garden': [
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&w=500&q=80', // Furniture
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&w=500&q=80', // Garden Tools
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&w=500&q=80', // Home Decor
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&w=500&q=80', // Kitchen Tools
    'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&w=500&q=80', // Lighting
  ],
  'Fashion': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&w=500&q=80', // Sneakers
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&w=500&q=80', // Jacket
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&w=500&q=80', // Watch
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&w=500&q=80', // Bag
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&w=500&q=80', // Sunglasses
  ],
  'Sports & Outdoors': [
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&w=500&q=80', // Bicycle
    'https://images.unsplash.com/photo-1515772255001-5bed6b49eb68?auto=format&w=500&q=80', // Fitness Equipment
    'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&w=500&q=80', // Tennis Racket
    'https://images.unsplash.com/photo-1518611507436-f9221403cca2?auto=format&w=500&q=80', // Skateboard
    'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&w=500&q=80', // Camping Gear
  ],
};

const generateDeal = (category, subcategory) => {
  const retailer = faker.helpers.arrayElement(retailers);
  const image = faker.helpers.arrayElement(categoryImages[category]);
  
  const originalPrice = faker.number.float({ min: 10, max: 2000, precision: 2 });
  const discountPercent = faker.number.float({ min: 0.1, max: 0.7, precision: 0.01 });
  const price = (originalPrice * (1 - discountPercent)).toFixed(2);
  const savings = (originalPrice - price).toFixed(2);

  return {
    title: `${retailer} - ${subcategory} Deal: ${faker.commerce.productName()}`,
    price: price.toString(),
    originalPrice: originalPrice.toFixed(2).toString(),
    savings: savings.toString(),
    description: faker.commerce.productDescription(),
    image,
    productUrl: faker.internet.url(),
    productId: faker.string.alphanumeric(10),
    retailer,
    category,
    subcategory,
    isActive: faker.datatype.boolean({ probability: 0.9 }), // 90% chance of being active
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    lastUpdated: faker.date.recent({ days: 7 }).toISOString()
  };
};

const generateDealsForCategory = async (category, subcategories) => {
  console.log(`\nGenerating deals for ${category}...`);
  const dealsToInsert = [];

  // Pre-generate all deals for this category in memory
  for (const subcategory of subcategories) {
    console.log(`  Pre-generating ${subcategory}...`);
    for (let i = 0; i < DEALS_PER_SUBCATEGORY; i++) {
      dealsToInsert.push(generateDeal(category, subcategory));
    }
  }

  // Insert deals in larger batches
  const batches = Math.ceil(dealsToInsert.length / BATCH_SIZE);
  console.log(`  Inserting ${batches} batches of ${BATCH_SIZE} deals...`);

  for (let i = 0; i < batches; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, dealsToInsert.length);
    const batch = dealsToInsert.slice(start, end);
    
    await Deal.insertMany(batch, { ordered: false }); // Use unordered inserts for better performance
    console.log(`    Inserted batch ${i + 1}/${batches}`);
  }

  return dealsToInsert.length;
};

const seedDatabase = async () => {
  let connection;
  try {
    // Connect to MongoDB with optimized settings
    connection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Performance optimizations
      writeConcern: { w: 1, j: false }, // Faster writes
      maxPoolSize: 10, // Increase connection pool
    });
    console.log('Connected to MongoDB');

    // Clear existing deals
    console.log('Clearing existing deals...');
    await Deal.deleteMany({});

    // Process categories in parallel
    const categoryPromises = Object.entries(categoryGroups).map(
      ([category, subcategories]) => generateDealsForCategory(category, subcategories)
    );

    // Wait for all categories to be processed
    const results = await Promise.all(categoryPromises);
    const totalDeals = results.reduce((sum, count) => sum + count, 0);
    
    console.log(`\nSuccessfully seeded ${totalDeals} deals`);
    
    // Log distribution using aggregation pipeline
    const distribution = await Deal.aggregate([
      {
        $group: {
          _id: { category: '$category', subcategory: '$subcategory' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.category': 1, '_id.subcategory': 1 } }
    ]).exec();
    
    // Format and display distribution
    console.log('\nDeals distribution:');
    const groupedDist = distribution.reduce((acc, item) => {
      if (!acc[item._id.category]) {
        acc[item._id.category] = [];
      }
      acc[item._id.category].push(`  ${item._id.subcategory}: ${item.count} deals`);
      return acc;
    }, {});

    Object.entries(groupedDist).forEach(([category, items]) => {
      console.log(`\n${category}:`);
      items.forEach(item => console.log(item));
    });

    // Graceful shutdown
    await connection.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    if (connection) {
      await connection.disconnect();
      console.log('Disconnected from MongoDB due to error');
    }
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Cleaning up...');
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error during cleanup:', err);
  }
  process.exit(0);
});

seedDatabase();
