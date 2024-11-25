import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Alert,
  Box,
  Typography,
  InputAdornment,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (userData: any) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      onSignup({
        ...formData,
        token: data.token
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxWidth: '450px',
          margin: '16px'
        }
      }}
    >
      <Paper elevation={0} sx={{ p: 3 }}>
        <Box sx={{ position: 'relative', mb: 3 }}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: -12,
              top: -12,
              color: 'text.secondary'
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              mb: 1
            }}>
              Create your account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join our community to get the best deals!
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: '8px'
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
          </Box>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Password must be at least 6 characters long"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{
              py: 1.5,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <Box sx={{ 
          mt: 3,
          pt: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Button
              color="primary"
              onClick={onClose}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline'
                }
              }}
            >
              Log in
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Dialog>
  );
};

export default SignupModal;
