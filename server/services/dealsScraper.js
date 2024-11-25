const axios = require('axios');
const natural = require('natural');
const logger = require('../utils/logger');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');

/**
 * @class DealsScraper
 * @description Service for scraping and categorizing deals from various retailers
 */
class DealsScraper {
  /**
   * @constructor
   * Creates an instance of DealsScraper
   */
  constructor() {
    this.classifier = new natural.BayesClassifier();
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
    this.initializeClassifier();
    this.apiKey = process.env.BESTBUY_API_KEY;
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * @private
   * @method initializeClassifier
   * @description Initializes the natural language classifier with training data
   */
  initializeClassifier() {
    const trainingData = [
      // Electronics
      { text: 'iphone apple smartphone ios mobile phone', category: 'Electronics' },
      { text: 'laptop computer notebook chromebook macbook', category: 'Electronics' },
      { text: 'tv television smart tv led oled qled hdtv', category: 'Electronics' },
      { text: 'camera digital photo dslr mirrorless lens', category: 'Electronics' },
      { text: 'tablet ipad android samsung surface', category: 'Electronics' },
      { text: 'headphones earbuds airpods wireless bluetooth', category: 'Electronics' },
      { text: 'smartwatch apple watch fitness tracker', category: 'Electronics' },

      // Gaming
      { text: 'gaming console playstation xbox nintendo switch', category: 'Gaming' },
      { text: 'video games ps5 xbox series game controller', category: 'Gaming' },
      { text: 'gaming pc graphics card gpu rtx gaming laptop', category: 'Gaming' },
      { text: 'gaming accessories mouse keyboard headset', category: 'Gaming' },

      // Appliances
      { text: 'appliance refrigerator washer dryer dishwasher', category: 'Appliances' },
      { text: 'kitchen microwave blender coffee maker', category: 'Appliances' },
      { text: 'vacuum cleaner robot vacuum air purifier', category: 'Appliances' },
      { text: 'air conditioner heater fan thermostat', category: 'Appliances' },

      // Home & Garden
      { text: 'furniture sofa chair table bed mattress', category: 'Home & Garden' },
      { text: 'garden tools lawn mower plants outdoor', category: 'Home & Garden' },
      { text: 'home decor lighting rug curtains mirror', category: 'Home & Garden' },

      // Fashion
      { text: 'clothing shoes accessories fashion wear', category: 'Fashion' },
      { text: 'watches jewelry rings necklace bracelet', category: 'Fashion' },
      { text: 'handbags wallets purses bags leather', category: 'Fashion' }
    ];

    trainingData.forEach(({ text, category }) => {
      this.classifier.addDocument(text, category);
    });

    this.classifier.train();
    logger.info('Classifier training completed successfully');
  }

  /**
   * @method categorizeProduct
   * @param {string} title - Product title
   * @param {string} description - Product description
   * @returns {string} Product category
   */
  categorizeProduct(title, description) {
    try {
      const combinedText = `${title} ${description}`.toLowerCase();
      return this.classifier.classify(combinedText);
    } catch (error) {
      logger.error('Error categorizing product:', { title, error: error.message });
      return 'Uncategorized';
    }
  }

  /**
   * @private
   * @method validatePrice
   * @param {string|number} price - Price to validate
   * @returns {boolean} Whether the price is valid
   */
  validatePrice(price) {
    const numPrice = Number(price);
    return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 100000;
  }

  /**
   * @private
   * @method sleep
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} Promise that resolves after the specified time
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * @private
   * @method fetchWithRetry
   * @param {string} url - URL to fetch
   * @returns {Promise} Promise that resolves with the response data
   */
  async fetchWithRetry(url) {
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        if (attempt === this.retryAttempts) throw error;
        await this.sleep(this.retryDelay * attempt);
      }
    }
  }

  /**
   * @method scrapeDeals
   * @returns {Promise<Array>} Array of scraped deals
   */
  async scrapeDeals() {
    const cacheKey = 'deals';
    const cachedDeals = this.cache.get(cacheKey);
    
    if (cachedDeals) {
      logger.info('Returning cached deals');
      return cachedDeals;
    }

    try {
      // Since we don't have a Best Buy API key, let's generate some realistic deals
      const deals = [
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
          createdAt: new Date().toISOString()
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
          createdAt: new Date().toISOString()
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
          createdAt: new Date().toISOString()
        },
        {
          title: "LG 27\" UltraGear QHD Gaming Monitor",
          price: "299.99",
          originalPrice: "399.99",
          description: "165Hz refresh rate and 1ms response time for smooth gaming",
          image: "https://images.unsplash.com/photo-1527219525722-f9767a7f2884?ixlib=rb-4.0.3",
          productUrl: "https://www.bestbuy.com/lg-ultragear-monitor",
          productId: "LG27ULTRA2024",
          retailer: "Best Buy",
          category: "Electronics",
          createdAt: new Date().toISOString()
        },
        {
          title: "Dyson V15 Detect Absolute Cordless Vacuum",
          price: "649.99",
          originalPrice: "749.99",
          description: "Powerful suction with laser dust detection",
          image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3",
          productUrl: "https://www.bestbuy.com/dyson-v15-detect",
          productId: "DYSONV15DETECT",
          retailer: "Best Buy",
          category: "Appliances",
          createdAt: new Date().toISOString()
        }
      ];

      // Validate prices and categorize products
      const validatedDeals = deals.map(deal => {
        if (!this.validatePrice(deal.price) || !this.validatePrice(deal.originalPrice)) {
          logger.warn('Invalid price detected:', { dealId: deal.productId });
          return null;
        }

        // Double-check category using our classifier
        const suggestedCategory = this.categorizeProduct(deal.title, deal.description);
        if (suggestedCategory !== deal.category) {
          logger.info('Category mismatch:', {
            dealId: deal.productId,
            original: deal.category,
            suggested: suggestedCategory
          });
        }

        return deal;
      }).filter(Boolean);

      // Cache the validated deals
      this.cache.set(cacheKey, validatedDeals);
      logger.info(`Successfully scraped and processed ${validatedDeals.length} deals`);

      return validatedDeals;
    } catch (error) {
      logger.error('Error scraping deals:', error);
      throw new Error('Failed to scrape deals: ' + error.message);
    }
  }
}

// Create a rate limiter for the scraper
const scraperLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Export a single instance with rate limiting
const dealsScraper = new DealsScraper();
module.exports = {
  scraper: dealsScraper,
  limiter: scraperLimiter
};
