require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Deal = require('../models/Deal');

const sampleDeals = [
  {
    title: "Samsung 65\" Class QN85C Neo QLED 4K Smart TV",
    price: "1499.99",
    originalPrice: "1999.99",
    description: "Experience stunning 4K resolution and vibrant colors with Samsung's Neo QLED technology",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3",
    productUrl: "https://www.bestbuy.com/samsung-65-neo-qled",
    productId: "SAMS65QLED2024",
    retailer: "Best Buy",
    category: "Electronics",
    isActive: true
  },
  {
    title: "MacBook Air 13.6\" Laptop - Apple M2 chip",
    price: "999.99",
    originalPrice: "1199.99",
    description: "Supercharged by the next-generation M2 chip",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?ixlib=rb-4.0.3",
    productUrl: "https://www.bestbuy.com/macbook-air-m2",
    productId: "APPLEM2MBA2024",
    retailer: "Best Buy",
    category: "Electronics",
    isActive: true
  },
  {
    title: "PS5 Console - God of War Ragnarök Bundle",
    price: "499.99",
    originalPrice: "559.99",
    description: "Experience the next generation of gaming",
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3",
    productUrl: "https://www.bestbuy.com/ps5-console-bundle",
    productId: "PS5GOWBUNDLE",
    retailer: "Best Buy",
    category: "Gaming",
    isActive: true
  }
];

async function seedDeals() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing deals
    await Deal.deleteMany({});
    console.log('Cleared existing deals');

    // Insert new deals
    await Deal.insertMany(sampleDeals);
    console.log('Sample deals inserted successfully');

    const count = await Deal.countDocuments();
    console.log(`Total deals in database: ${count}`);

  } catch (error) {
    console.error('Error seeding deals:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding
seedDeals();
