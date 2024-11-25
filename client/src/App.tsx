import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Typography, Box, Paper, Button, CircularProgress, IconButton } from '@mui/material';
import { Refresh as RefreshIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
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
    const storedUserData = localStorage.getItem('userData');

    console.log('Stored user data:', storedUserData);

    if (token && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        console.log('Parsed user data:', userData);
        console.log('User data keys:', Object.keys(userData));
        console.log('User data values:', Object.values(userData));
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }

      // Test endpoint logic
      fetch('http://localhost:3001/api/test')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Test endpoint failed with status: ${response.status}`);
          }
          return response.json();
        })
        .then((testData) => {
          console.log('Test endpoint response:', testData);
        })
        .catch((testError) => {
          console.error('Test endpoint failed:', testError);
        });
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Fetched user data:', userData);
        localStorage.setItem(
          'userData',
          JSON.stringify({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          })
        );
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    if (deals.length === 0 && !loading && !error) {
      console.log('No deals found, retrying fetch...');
      fetchDeals();
    }
  }, [deals.length, loading, error]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching deals...');

      // Test endpoint logic
      fetch('http://localhost:3001/api/test')
        .then((response) => response.json())
        .then((data) => {
          console.log('Test endpoint response:', data);
        })
        .catch((error) => console.error('Test endpoint error:', error));

      const response = await fetch('http://localhost:3001/api/deals', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched deals:', data);

      if (Array.isArray(data)) {
        setDeals(data);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredDeals = useMemo(() => {
    return deals.filter(
      (deal) =>
        (selectedCategory === 'All' || deal.category === selectedCategory) &&
        (searchQuery === '' ||
          deal.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [deals, selectedCategory, searchQuery]);

  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(
    location.pathname
  );

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
          firstName={user?.firstName || 'User'}
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
              filteredDeals.map((deal) => (
                <DealCard key={deal._id} deal={deal} />
              ))
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
        <Route path="/" element={<AppContent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/alerts" element={<DealAlerts />} />
      </Routes>
    </Router>
  );
}

export default App;
