# DealsHunter

A modern full-stack web application for aggregating and displaying the best deals across multiple retailers.

## Features

- 🔍 Smart deal search and filtering
- 📱 Responsive, mobile-first design
- 🎯 Category-based deal organization
- 👤 User authentication and profiles
- 🔔 Deal alerts and notifications
- 💼 Multi-retailer support
- 🎨 Modern Material-UI design
- 📊 Interactive deal carousels
- 🚀 Optimized performance with React hooks
- 🎭 Smooth animations and transitions
- 📱 Adaptive layout for all screen sizes
- 🔄 Dynamic category filtering

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- React Multi Carousel for deal displays
- Font Awesome icons
- Custom CSS with modern features
- Performance optimizations with useMemo and useCallback

### Performance Features
- Memoized components and computations
- Optimized state management
- Efficient filtering and search
- Responsive image loading
- Smooth animations
- Debounced search input
- Optimized carousel rendering

### Responsive Design
- Desktop (1440px+): 4 items per row
- Large Tablet (1024px-1440px): 3 items per row
- Tablet (640px-1024px): 2 items per row
- Mobile (<640px): 1 item per row

### UI Components
- Category sidebar with expandable sections
- Dynamic deal carousels
- Responsive navigation
- Search functionality
- Modern card design
- Smooth transitions

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` in the repository root and update the values:
   ```bash
   cp .env.example .env
   ```
   Customize the variables for your environment (database URL, JWT secret, email settings, etc.).

4. Seed the database:
   ```bash
   cd server
   node scripts/generateDeals.js
   ```

5. Start the development servers:
   ```bash
   # Start the backend server (from server directory)
   npm start

   # Start the frontend development server (from client directory)
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Project Structure

```
my-website/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main application component
│   │   └── index.tsx     # Application entry point
│   └── package.json      # Frontend dependencies
│
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── server.js         # Server entry point
│   └── package.json      # Backend dependencies
│
└── README.md             # Project documentation
```

## Data Seeding

The application comes with a powerful data seeder that generates realistic deal data across multiple categories and subcategories.

### Running the Seeder

```bash
cd server
node scripts/generateDeals.js
```

The seeder will:
1. Clear existing deals from the database
2. Generate 30 deals for each subcategory (~1080 total deals)
3. Create realistic product titles, descriptions, and prices
4. Assign deals to various retailers
5. Insert deals in batches of 10 for optimal performance

### Supported Retailers

The seeder randomly assigns deals to these popular retailers:
- Amazon
- Best Buy
- Walmart
- Target
- eBay
- Newegg
- B&H Photo
- Costco
- Home Depot
- Lowes

### Available Categories

1. Electronics
   - Smartphones
   - Laptops
   - TVs
   - Audio
   - Cameras
   - Accessories

2. Gaming
   - Consoles
   - Video Games
   - Gaming PCs
   - Accessories
   - VR
   - Gaming Chairs

3. Appliances
   - Kitchen
   - Laundry
   - Refrigerators
   - Dishwashers
   - Air Conditioners
   - Vacuums

4. Home & Garden
   - Furniture
   - Decor
   - Kitchen
   - Bedding
   - Garden Tools
   - Lighting

5. Fashion
   - Men's Clothing
   - Women's Clothing
   - Shoes
   - Accessories
   - Jewelry
   - Watches

6. Sports & Outdoors
   - Exercise Equipment
   - Outdoor Recreation
   - Sports Gear
   - Camping
   - Fishing
   - Cycling

### Generated Data

Each deal includes:
- Title and description
- Original and discounted prices
- Discount percentage (10-70%)
- Category and subcategory
- Retailer
- Creation date (within last year)
- Active status (90% probability)
- Product images (5 per category)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
