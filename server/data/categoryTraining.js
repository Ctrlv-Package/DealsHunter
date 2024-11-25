const categoryTrainingData = {
  Electronics: {
    keywords: [
      'laptop', 'computer', 'phone', 'smartphone', 'tablet', 'tv', 'television',
      'headphones', 'earbuds', 'speaker', 'monitor', 'camera', 'gaming',
      'console', 'wireless', 'bluetooth', 'charger', 'battery', 'smart home',
      'router', 'keyboard', 'mouse', 'printer', 'scanner'
    ],
    synonyms: {
      'laptop': ['notebook', 'chromebook', 'macbook', 'ultrabook'],
      'phone': ['mobile', 'cellphone', 'iphone', 'android'],
      'tv': ['television', 'smart tv', 'led tv', 'oled', 'qled'],
      'headphones': ['headset', 'earphones', 'airpods', 'buds'],
      'camera': ['dslr', 'mirrorless', 'webcam', 'digital camera']
    },
    brands: [
      'Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus',
      'Acer', 'Microsoft', 'Logitech', 'Canon', 'Nikon', 'Bose', 'JBL'
    ]
  },
  
  Fashion: {
    keywords: [
      'clothing', 'shoes', 'accessories', 'watch', 'jewelry', 'handbag',
      'wallet', 'sunglasses', 'hat', 'scarf', 'belt', 'dress', 'shirt',
      'pants', 'jeans', 'jacket', 'coat', 'sweater', 'boots', 'sneakers'
    ],
    synonyms: {
      'shoes': ['footwear', 'sneakers', 'boots', 'sandals'],
      'clothing': ['apparel', 'wear', 'garments', 'outfit'],
      'jewelry': ['accessories', 'necklace', 'bracelet', 'ring'],
      'handbag': ['purse', 'bag', 'tote', 'clutch'],
      'watch': ['timepiece', 'smartwatch', 'wristwatch']
    },
    brands: [
      'Nike', 'Adidas', 'Under Armour', 'Levi\'s', 'Gap', 'H&M', 'Zara',
      'Ralph Lauren', 'Tommy Hilfiger', 'Michael Kors', 'Coach', 'Gucci'
    ]
  },
  
  Home: {
    keywords: [
      'furniture', 'decor', 'kitchen', 'bedding', 'lighting', 'storage',
      'organization', 'bathroom', 'appliance', 'rug', 'curtain', 'mirror',
      'table', 'chair', 'sofa', 'bed', 'mattress', 'lamp', 'shelf'
    ],
    synonyms: {
      'furniture': ['furnishing', 'decor', 'home goods'],
      'lighting': ['lamp', 'light fixture', 'chandelier', 'sconce'],
      'storage': ['organizer', 'cabinet', 'drawer', 'shelf'],
      'appliance': ['machine', 'device', 'gadget', 'equipment']
    },
    brands: [
      'IKEA', 'Wayfair', 'Ashley Furniture', 'Crate & Barrel', 'West Elm',
      'Pottery Barn', 'HomeGoods', 'Dyson', 'KitchenAid', 'Whirlpool'
    ]
  },
  
  Beauty: {
    keywords: [
      'makeup', 'skincare', 'haircare', 'fragrance', 'cosmetics', 'beauty',
      'nail', 'face', 'hair', 'body', 'lotion', 'cream', 'serum', 'shampoo',
      'conditioner', 'perfume', 'cologne'
    ],
    synonyms: {
      'makeup': ['cosmetics', 'beauty products', 'foundation', 'lipstick'],
      'skincare': ['face care', 'skin treatment', 'moisturizer'],
      'haircare': ['hair products', 'hair treatment', 'styling'],
      'fragrance': ['perfume', 'cologne', 'scent', 'eau de toilette']
    },
    brands: [
      'MAC', 'Sephora', 'L\'Oreal', 'Maybelline', 'Estee Lauder', 'Clinique',
      'Neutrogena', 'Olay', 'Dove', 'Pantene', 'Bath & Body Works'
    ]
  },
  
  Sports: {
    keywords: [
      'fitness', 'exercise', 'sports', 'outdoor', 'camping', 'gym', 'workout',
      'training', 'athletic', 'bike', 'bicycle', 'swimming', 'running',
      'yoga', 'hiking', 'tennis', 'golf'
    ],
    synonyms: {
      'fitness': ['exercise', 'workout', 'training', 'gym'],
      'sports': ['athletics', 'games', 'activities'],
      'outdoor': ['camping', 'hiking', 'adventure', 'recreation'],
      'bike': ['bicycle', 'cycling', 'mountain bike']
    },
    brands: [
      'Nike', 'Adidas', 'Under Armour', 'The North Face', 'Columbia',
      'Patagonia', 'REI', 'Coleman', 'Wilson', 'Callaway'
    ]
  }
};

// Generate expanded training data with variations
function generateTrainingData() {
  const trainingData = [];
  
  Object.entries(categoryTrainingData).forEach(([category, data]) => {
    // Add main keywords
    data.keywords.forEach(keyword => {
      trainingData.push({ text: keyword, category });
      // Add with brand combinations
      data.brands.forEach(brand => {
        trainingData.push({ text: `${brand} ${keyword}`, category });
        trainingData.push({ text: `${keyword} by ${brand}`, category });
      });
    });
    
    // Add synonyms and their variations
    Object.entries(data.synonyms).forEach(([word, synonyms]) => {
      synonyms.forEach(synonym => {
        trainingData.push({ text: synonym, category });
        // Add with brand combinations
        data.brands.forEach(brand => {
          trainingData.push({ text: `${brand} ${synonym}`, category });
          trainingData.push({ text: `${synonym} from ${brand}`, category });
        });
      });
    });
    
    // Add brand-only entries with lower weight
    data.brands.forEach(brand => {
      trainingData.push({ text: brand, category, weight: 0.5 });
    });
  });
  
  return trainingData;
}

module.exports = {
  categoryTrainingData,
  generateTrainingData
};
