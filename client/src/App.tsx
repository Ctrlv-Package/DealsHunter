import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import './App.css';
import logo from './assets/logo.svg';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserProfilePage from './pages/UserProfilePage';
import DealAlerts from './components/DealAlerts/DealAlerts';
import CategorySidebar from './components/CategorySidebar';
import DealCard from './components/DealCard';
import Navbar from './components/Navbar';
import { Deal } from './types/Deal';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

function AppContent() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userData');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        handleLogout();
      }
    } else {
      handleLogout();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001/api/deals');
      if (!response.ok) {
        throw new Error(`Failed to fetch deals: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setDeals(data);
      } else {
        throw new Error('Invalid data format from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = useMemo(() => {
    return deals.filter(
      (deal) =>
        (selectedCategory === 'All' || deal.category === selectedCategory) &&
        (searchQuery === '' ||
          deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [deals, selectedCategory, searchQuery]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const carouselResponsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1600 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1600, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 768, min: 480 },
      items: 2,
    },
    smallMobile: {
      breakpoint: { max: 480, min: 0 },
      items: 1,
    },
  };

  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <img src={logo} alt="DealsHunter Logo" className="app-logo" />
          <span className="site-name">DealsHunter</span>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for the best deals..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Navbar
          isAuthenticated={isAuthenticated}
          firstName={user?.firstName || 'Guest'}
          onLogout={handleLogout}
        />
      </header>
      {!isAuthPage && (
        <div className="main-content">
          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          <div className="deals-container">
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Paper>
                <Typography color="error">{error}</Typography>
              </Paper>
            ) : (
              filteredDeals.map((deal) => <DealCard key={deal._id} deal={deal} />)
            )}
          </div>
        </div>
      )}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <UserProfilePage /> : <LoginPage />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
