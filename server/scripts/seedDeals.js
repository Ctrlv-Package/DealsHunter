const mongoose = require('mongoose');
const Deal = require('../models/Deal');
const DealsScraper = require('../services/dealsScraper');

async function seedDatabase() {
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

    // Initialize and run the scraper
    console.log('Starting to scrape deals...');
    const scrapedDeals = await DealsScraper.scrapeDeals();
    console.log(`Scraped ${scrapedDeals.length} deals`);

    if (scrapedDeals.length > 0) {
      // Insert scraped deals
      await Deal.insertMany(scrapedDeals);
      console.log('Scraped deals inserted successfully');
    } else {
      // Insert fallback sample deals if scraping fails
      const sampleDeals = [
        {
          title: "Samsung 65\" 4K Smart TV",
          price: "699.99",
          originalPrice: "999.99",
          image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3",
          productId: "SAMS65TV2023",
          category: "Electronics",
          description: "Amazing 4K resolution with HDR support",
          retailer: "BestBuy",
          productUrl: "https://www.bestbuy.com",
          createdAt: new Date()
        },
        {
          title: "Apple AirPods Pro (2nd Generation)",
          price: "199.99",
          originalPrice: "249.99",
          image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3",
          productId: "AIRPODSPRO2",
          category: "Electronics",
          description: "Active noise cancellation and spatial audio",
          retailer: "Amazon",
          productUrl: "https://www.amazon.com",
          createdAt: new Date()
        },
        {
          title: "Nike Air Max 270",
          price: "89.99",
          originalPrice: "150.00",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3",
          productId: "NIKEAM270",
          category: "Clothes",
          description: "Comfortable and stylish sneakers",
          retailer: "Nike",
          productUrl: "https://www.nike.com",
          createdAt: new Date()
        },
        {
          title: "Dyson V15 Detect Vacuum",
          price: "599.99",
          originalPrice: "749.99",
          image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3",
          productId: "DYSONV15",
          category: "Household Goods",
          description: "Powerful cordless vacuum with laser detection",
          retailer: "Dyson",
          productUrl: "https://www.dyson.com",
          createdAt: new Date()
        },
        {
          title: "LEGO Star Wars Millennium Falcon",
          price: "129.99",
          originalPrice: "169.99",
          image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?ixlib=rb-4.0.3",
          productId: "LEGOSW75257",
          category: "Toys",
          description: "Build the iconic spaceship",
          retailer: "Target",
          productUrl: "https://www.target.com",
          createdAt: new Date()
        }
      ];
      
      await Deal.insertMany(sampleDeals);
      console.log('Fallback sample deals inserted successfully');
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
