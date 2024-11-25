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

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- React Multi Carousel for deal displays
- Custom CSS for styling

### Backend
- Node.js with Express
- MongoDB for data storage
- Mongoose for data modeling
- JWT for authentication
- Custom scraping service

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
   Create a `.env` file in the server directory with:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/deals_db
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

4. Seed the database:
   ```bash
   cd server
   node seedDeals.js
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

## Available Categories

- Electronics
- Gaming
- Appliances
- Home & Garden
- Fashion
- Sports & Outdoors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
