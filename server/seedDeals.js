require('dotenv').config();
const mongoose = require('mongoose');
const Deal = require('./models/Deal');

const sampleDeals = [
  // Amazon Deals
  {
    title: "Echo Dot (5th Gen) Smart Speaker",
    price: "29.99",
    originalPrice: "49.99",
    image: "https://m.media-amazon.com/images/I/71xoR4A6q3L._AC_SL1000_.jpg",
    productId: "B09B8V1LZ3",
    retailer: "Amazon",
    savings: "40%",
    productUrl: "https://www.amazon.com/dp/B09B8V1LZ3",
    category: "Electronics",
    isActive: true
  },
  {
    title: "Samsung Galaxy Buds2 Pro",
    price: "179.99",
    originalPrice: "229.99",
    image: "https://m.media-amazon.com/images/I/61Qqg+T8nsL._AC_SL1500_.jpg",
    productId: "B0B15JDKXD",
    retailer: "Amazon",
    savings: "22%",
    productUrl: "https://www.amazon.com/dp/B0B15JDKXD",
    category: "Electronics",
    isActive: true
  },

  // Best Buy Deals
  {
    title: 'LG - 65" Class C3 Series OLED 4K TV',
    price: "1699.99",
    originalPrice: "2499.99",
    image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6537/6537440_sd.jpg",
    productId: "6537440",
    retailer: "Best Buy",
    savings: "32%",
    productUrl: "https://www.bestbuy.com/site/6537440.p",
    category: "Electronics",
    isActive: true
  },
  {
    title: 'MacBook Air 13.6" Laptop - M2',
    price: "1049.99",
    originalPrice: "1199.99",
    image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6509/6509650_sd.jpg",
    productId: "6509650",
    retailer: "Best Buy",
    savings: "13%",
    productUrl: "https://www.bestbuy.com/site/6509650.p",
    category: "Electronics",
    isActive: true
  },

  // Walmart Deals
  {
    title: 'SAMSUNG 65" Class 4K Crystal UHD TV',
    price: "447.99",
    originalPrice: "527.99",
    image: "https://i5.walmartimages.com/asr/9d2c6cf5-9797-4a56-94f8-b43f2c833f94.64b9e93094ea3e23e194552c1c9f553e.jpeg",
    productId: "SAMTU7000",
    retailer: "Walmart",
    savings: "15%",
    productUrl: "https://www.walmart.com/ip/SAMTU7000",
    category: "Electronics",
    isActive: true
  },
  {
    title: "Apple AirPods Pro (2nd Generation)",
    price: "199.99",
    originalPrice: "249.00",
    image: "https://i5.walmartimages.com/asr/7498d7d2-3c7a-4c0f-a35c-8df58a1bdb63.4c69d52f11f1c41a1f10bc55c50e4e7f.jpeg",
    productId: "APPAIRPODSPRO2",
    retailer: "Walmart",
    savings: "20%",
    productUrl: "https://www.walmart.com/ip/APPAIRPODSPRO2",
    category: "Electronics",
    isActive: true
  },

  // Target Deals
  {
    title: "Apple Watch SE (2nd Gen)",
    price: "219.99",
    originalPrice: "249.99",
    image: "https://target.scene7.com/is/image/Target/GUEST_7c6b1622-6d3d-4657-8fef-ea6763493a47",
    productId: "85896532",
    retailer: "Target",
    savings: "12%",
    productUrl: "https://www.target.com/p/85896532",
    category: "Electronics",
    isActive: true
  },
  {
    title: "Dyson V8 Origin+ Cordless Vacuum",
    price: "299.99",
    originalPrice: "399.99",
    image: "https://target.scene7.com/is/image/Target/GUEST_0c8b0a6e-f6e2-47ab-9f67-dc2c46f4ff67",
    productId: "83421528",
    retailer: "Target",
    savings: "25%",
    productUrl: "https://www.target.com/p/83421528",
    category: "Home & Garden",
    isActive: true
  }
];

async function seedDeals() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deals_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing deals
    await Deal.deleteMany({});
    console.log('Cleared existing deals');

    // Insert new deals
    const result = await Deal.insertMany(sampleDeals);
    console.log(`Successfully inserted ${result.length} deals\n`);

    // Log deals by retailer
    const dealsByRetailer = {};
    for (const deal of result) {
      dealsByRetailer[deal.retailer] = (dealsByRetailer[deal.retailer] || 0) + 1;
    }
    console.log('Deals by retailer:');
    Object.entries(dealsByRetailer).forEach(([retailer, count]) => {
      console.log(`${retailer}: ${count} deals`);
    });

  } catch (error) {
    console.error('Error seeding deals:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
}

seedDeals();
