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

interface AppContentProps {
  // No props
}

function AppContent() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    if (token) {
      setIsAuthenticated(true);
      setUserName(storedUserName || undefined);
    } else {
      setIsAuthenticated(false);
      setUserName(undefined);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserName(undefined);
  };

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching deals...');
      
      // First try the test endpoint
      try {
        const testResponse = await fetch('http://localhost:3001/api/test');
        if (!testResponse.ok) {
          throw new Error(`Test endpoint failed with status: ${testResponse.status}`);
        }
        const testData = await testResponse.json();
        console.log('Test endpoint response:', testData);
      } catch (testError) {
        console.error('Test endpoint failed:', testError);
      }
      
      // Now try the deals endpoint
      const response = await fetch('http://localhost:3001/api/deals', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch deals: ${response.status} ${response.statusText}\n${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log('Deals data:', data);
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('Received non-array data:', data);
        setDeals([]);
        throw new Error('Invalid data format received from server');
      }
      
      setDeals(data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredDeals = useMemo(() => {
    // Ensure deals is an array before using filter
    if (!Array.isArray(deals)) {
      console.error('Deals is not an array:', deals);
      return {};
    }

    // Filter deals by search query and category/subcategory
    const filteredDeals = deals.filter(deal => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.retailer?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'All' || 
        deal.category === selectedCategory || 
        deal.subcategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Group the filtered deals by category
    const dealsMap: { [key: string]: Deal[] } = {};
    filteredDeals.forEach(deal => {
      const groupKey = selectedCategory === deal.subcategory ? deal.subcategory : deal.category;
      if (!dealsMap[groupKey]) {
        dealsMap[groupKey] = [];
      }
      dealsMap[groupKey].push(deal);
    });

    return dealsMap;
  }, [deals, selectedCategory, searchQuery]);

  const carouselResponsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1600 },
      items: 5,
      slidesToSlide: 2,
    },
    desktop: {
      breakpoint: { max: 1600, min: 1024 },
      items: 4,
      slidesToSlide: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 768, min: 480 },
      items: 2,
      slidesToSlide: 1,
    },
    smallMobile: {
      breakpoint: { max: 480, min: 0 },
      items: 1,
      slidesToSlide: 1,
    }
  };

  const CustomButtonGroup = ({ next, previous, carouselState }: any) => {
    if (!carouselState) return null;
    
    return (
      <div className="carousel-button-group">
        <IconButton 
          className="custom-carousel-button prev" 
          onClick={previous}
          aria-label="Previous"
          size="large"
        >
          <ChevronLeft />
        </IconButton>
        <IconButton 
          className="custom-carousel-button next" 
          onClick={next}
          aria-label="Next"
          size="large"
        >
          <ChevronRight />
        </IconButton>
      </div>
    );
  };

  // Don't show sidebar on auth pages
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <img src={logo} alt="Daily Deals Logo" className="app-logo" />
          <span className="site-name">DealsHunter</span>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for deals..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="header-right">
          <Navbar 
            isAuthenticated={isAuthenticated} 
            userName={userName}
            onLogout={handleLogout}
          />
        </div>
      </header>
      
      {!isAuthPage && (
        <div className="main-content">
          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          <div className="deals-container">
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 300,
                  width: '100%',
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  minHeight: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography variant="h6" color="error">
                  Error Loading Deals
                </Typography>
                <Typography color="text.secondary">
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={fetchDeals}
                >
                  Try Again
                </Button>
              </Paper>
            ) : (
              Object.entries(filteredDeals).map(([category, categoryDeals]) => (
                <Paper
                  key={category}
                  elevation={1}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      marginBottom: 2,
                      color: 'text.primary',
                    }}
                  >
                    {category}
                  </Typography>
                  <div className="carousel-section">
                    <Carousel
                      responsive={carouselResponsive}
                      infinite={false}
                      className="deals-carousel"
                      customButtonGroup={<CustomButtonGroup />}
                      arrows={false}
                      renderButtonGroupOutside={false}
                      autoPlay={false}
                      swipeable={true}
                      draggable={true}
                      partialVisible={false}
                      customTransition="transform 300ms ease-in-out"
                      transitionDuration={300}
                      containerClass="carousel-container"
                      itemClass="carousel-item"
                      shouldResetAutoplay={false}
                    >
                      {categoryDeals.map((deal) => (
                        <Box key={deal._id}>
                          <DealCard deal={deal} />
                        </Box>
                      ))}
                    </Carousel>
                  </div>
                </Paper>
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
