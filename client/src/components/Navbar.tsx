import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

interface NavbarProps {
  isAuthenticated: boolean;
  userName?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, userName, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };

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
          <>
            <Typography 
              variant="body1" 
              sx={{ 
                display: 'inline-block', 
                mr: 2,
                verticalAlign: 'middle',
                lineHeight: '36px'  // Match button height
              }}
            >
              Hi, {userName}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              sx={{ mr: 1 }}
            >
              Logout
            </Button>
          </>
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
