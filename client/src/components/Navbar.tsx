import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

interface NavbarProps {
  isAuthenticated: boolean;
  firstName?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, firstName, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="navbar">
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center"
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate('/alerts')}
          startIcon={<span role="img" aria-label="alerts">🔔</span>}
        >
          Deals Alerts
        </Button>
        
        {isAuthenticated ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'primary.main',
                minWidth: 'max-content'
              }}
            >
              Hi, {firstName}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/login')}
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
          </Stack>
        )}
      </Stack>
    </nav>
  );
};

export default Navbar;
