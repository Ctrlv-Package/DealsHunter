import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './App.css';
import logo from './assets/logo.svg';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserProfilePage from './pages/UserProfilePage';
import AlertsPage from './pages/AlertsPage';
import DealAlerts from './components/DealAlerts/DealAlerts';
import CategorySidebar from './components/CategorySidebar';
import DealCard from './components/DealCard';
import Navbar from './components/Navbar';
import { Deal } from './types/Deal';
import useDebounce from './hooks/useDebounce';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

function AppContent() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Deal[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
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

  const fetchDeals = async (pageToLoad = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:3001/api/deals?page=${pageToLoad}&limit=50`);
      if (!response.ok) {
        throw new Error(`Failed to fetch deals: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.deals)) {
        setDeals(prev => pageToLoad === 1 ? data.deals : [...prev, ...data.deals]);
        setPage(data.page);
        setTotalPages(data.totalPages);
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
    fetchDeals(1);
  }, []);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchSearchResults = async (query: string) => {
    try {
      setSearchLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:3001/api/deals/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`Failed to search deals: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setSearchResults(data);
      } else {
        throw new Error('Invalid search data format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch.trim()) {
      fetchSearchResults(debouncedSearch.trim());
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  const categoryGroups = useMemo(() => ({
    'Electronics': ['Smartphones', 'Laptops', 'TVs', 'Audio', 'Cameras', 'Accessories'],
    'Gaming': ['Consoles', 'Video Games', 'Gaming PCs', 'Accessories', 'VR', 'Gaming Chairs'],
    'Appliances': ['Kitchen', 'Laundry', 'Refrigerators', 'Dishwashers', 'Air Conditioners', 'Vacuums'],
    'Home & Garden': ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Garden Tools', 'Lighting'],
    'Fashion': ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry', 'Watches'],
    'Sports & Outdoors': ['Exercise Equipment', 'Outdoor Recreation', 'Sports Gear', 'Camping', 'Fishing', 'Cycling']
  }), []);

  const carouselResponsive = useMemo(() => ({
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1440 },
      items: 4,
      slidesToSlide: 4,
      partialVisibilityGutter: 0
    },
    desktop: {
      breakpoint: { max: 1440, min: 1024 },
      items: 3,
      slidesToSlide: 3,
      partialVisibilityGutter: 0
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
      slidesToSlide: 2,
      partialVisibilityGutter: 0
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 0
    }
  }), []);

  const filteredDeals = useMemo(() => {
    const baseDeals = searchQuery ? searchResults : deals;
    if (!baseDeals) return [];
    let filtered = [...baseDeals];

    if (selectedCategory) {
      filtered = filtered.filter(deal => deal.category === selectedCategory);
      if (selectedSubcategory) {
        filtered = filtered.filter(deal => deal.subcategory === selectedSubcategory);
      }
    }

    return filtered;
  }, [deals, searchResults, searchQuery, selectedCategory, selectedSubcategory]);

  const dealsByCategory = useMemo(() => {
    const groupedDeals: { [key: string]: Deal[] } = {};
    Object.keys(categoryGroups).forEach(category => {
      groupedDeals[category] = filteredDeals.filter(deal => deal.category === category);
    });
    return groupedDeals;
  }, [filteredDeals, categoryGroups]);

  const getCategoryIcon = useCallback((category: string) => {
    switch (category) {
      case 'Electronics':
        return <i className="fas fa-tv" />;
      case 'Gaming':
        return <i className="fas fa-gamepad" />;
      case 'Appliances':
        return <i className="fas fa-blender" />;
      case 'Home & Garden':
        return <i className="fas fa-home" />;
      case 'Fashion':
        return <i className="fas fa-tshirt" />;
      case 'Sports & Outdoors':
        return <i className="fas fa-running" />;
      default:
        return null;
    }
  }, []);

  const handleCategoryClick = useCallback((category: string) => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
    setSelectedSubcategory(null);
  }, []);

  const handleSubcategoryClick = useCallback((subcategory: string) => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedSubcategory(prevSubcategory =>
      prevSubcategory === subcategory ? null : subcategory
    );
  }, []);

  const MemoizedDealCard = useMemo(() => 
    React.memo(DealCard, (prevProps, nextProps) => {
      return prevProps.deal._id === nextProps.deal._id;
    })
  , []);

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
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>
        <Navbar
          isAuthenticated={isAuthenticated}
          firstName={user?.firstName || 'Guest'}
          onLogout={handleLogout}
        />
      </header>
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/signup" element={<SignupPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<UserProfilePage user={user} />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/" element={
          <div className="main-content">
            <div className="category-sidebar">
              <Typography 
                variant="h6" 
                className="sidebar-title"
                sx={{ 
                  padding: '1rem',
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <i className="fas fa-filter" />
                Categories
              </Typography>
              <List>
                {Object.entries(categoryGroups).map(([category, subcategories]) => (
                  <div key={category}>
                    <ListItemButton 
                      onClick={() => handleCategoryClick(category)}
                      selected={selectedCategory === category}
                    >
                      <ListItemIcon>
                        {getCategoryIcon(category)}
                      </ListItemIcon>
                      <ListItemText primary={category} />
                      {selectedCategory === category ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>
                    <Collapse in={selectedCategory === category} timeout={200}>
                      <List component="div" disablePadding>
                        {subcategories.map((subcategory) => (
                          <ListItemButton
                            key={subcategory}
                            sx={{ pl: 4 }}
                            onClick={() => handleSubcategoryClick(subcategory)}
                            selected={selectedSubcategory === subcategory}
                          >
                            <ListItemText primary={subcategory} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </div>
                ))}
              </List>
            </div>
            <div className="deals-container">
              {loading || searchLoading ? (
                <CircularProgress />
              ) : error ? (
                <Paper>
                  <Typography color="error">{error}</Typography>
                </Paper>
              ) : (
                <>
                <div className="categories-container">
                  {Object.entries(categoryGroups).map(([category, subcategories]) => {
                    const categoryDeals = dealsByCategory[category];
                    if (!categoryDeals || categoryDeals.length === 0) return null;
                    
                    return (
                      <div key={category} className="category-section">
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            mb: 2, 
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          {getCategoryIcon(category)}
                          {category}
                        </Typography>
                        <div className="carousel-section">
                          <Carousel
                            responsive={carouselResponsive}
                            infinite={true}
                            keyBoardControl={true}
                            removeArrowOnDeviceType={["mobile"]}
                            containerClass="carousel-container"
                            itemClass="carousel-item"
                            partialVisible={false}
                            centerMode={false}
                            swipeable={true}
                            draggable={true}
                            minimumTouchDrag={80}
                            ssr={false}
                            shouldResetAutoplay={false}
                          >
                            {categoryDeals.map((deal) => (
                              <div key={deal._id} className="carousel-item-wrapper">
                                <MemoizedDealCard deal={deal} />
                              </div>
                            ))}
                          </Carousel>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {page < totalPages && (
                  <Box textAlign="center" mt={4}>
                    <Button variant="outlined" onClick={() => fetchDeals(page + 1)} disabled={loading}>
                      {loading ? 'Loading...' : 'Load More'}
                    </Button>
                  </Box>
                )}
                </>
              )}
            </div>
          </div>
        } />
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
