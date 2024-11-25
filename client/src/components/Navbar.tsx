import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

interface NavbarProps {
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/alerts')}
          startIcon={<span role="img" aria-label="alerts">🔔</span>}
          sx={{ mr: 1 }}
        >
          Deals Alerts
        </Button>
        
        {isAuthenticated ? (
          <div className="user-menu">
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/profile')}
              startIcon={<span role="img" aria-label="user">👤</span>}
            >
              My Profile
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ mr: 1 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
