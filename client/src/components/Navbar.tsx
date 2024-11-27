import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography, alpha, Avatar } from '@mui/material';
import {
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

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
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          onClick={() => navigate('/alerts')}
          startIcon={<NotificationsIcon />}
          sx={{
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
            },
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          Deal Alerts
        </Button>

        {isAuthenticated ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              sx={{
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                color: 'success.main',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.15),
                },
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              onClick={() => navigate('/profile')}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'success.main',
                  color: 'white',
                }}
              >
                <PersonIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                Hi, {firstName || 'User'}
              </Typography>
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                borderColor: (theme) => alpha(theme.palette.error.main, 0.5),
                color: 'error.main',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                  borderColor: 'error.main',
                },
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              startIcon={<LoginIcon />}
              sx={{
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                color: 'primary.main',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  borderColor: 'primary.main',
                },
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/signup')}
              startIcon={<PersonAddIcon />}
              sx={{
                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                color: 'white',
                '&:hover': {
                  background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                },
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 1,
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
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
