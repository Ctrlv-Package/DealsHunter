const mongoose = require('mongoose');
const Deal = require('./models/Deal');

const deals = [
  {
    title: 'Echo Dot (5th Gen)',
    price: '29.99',
    originalPrice: '49.99',
    image: 'https://m.media-amazon.com/images/I/71xoR4A6q3L._AC_SL1000_.jpg',
    productId: 'SAMPLE001',
    retailer: 'Amazon',
    productUrl: 'https://www.amazon.com',
    category: 'Electronics',
    isActive: true
  },
  {
    title: 'Samsung Galaxy Buds2 Pro',
    price: '179.99',
    originalPrice: '229.99',
    image: 'https://m.media-amazon.com/images/I/61Qqg+T8nsL._AC_SL1500_.jpg',
    productId: 'SAMPLE002',
    retailer: 'Amazon',
    productUrl: 'https://www.amazon.com',
    category: 'Electronics',
    isActive: true
  },
  {
    title: "Men's Running Shoes",
    price: '79.99',
    originalPrice: '129.99',
    image: 'https://example.com/shoes.jpg',
    productId: 'SAMPLE003',
    retailer: 'Nike',
    productUrl: 'https://www.nike.com',
    category: 'Fashion',
    isActive: true
  }
];

async function initDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/deals_db');
    console.log('Connected to MongoDB');

    // Clear existing deals
    await Deal.deleteMany({});
    console.log('Cleared existing deals');

    // Insert new deals
    await Deal.insertMany(deals);
    console.log('Inserted sample deals');

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initDB();
