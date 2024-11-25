import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { label: 'At least 8 characters long', regex: /.{8,}/, met: false },
    { label: 'One uppercase letter', regex: /[A-Z]/, met: false },
    { label: 'One lowercase letter', regex: /[a-z]/, met: false },
    { label: 'One special character (!@#$%^&*)', regex: /[!@#$%^&*]/, met: false }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update password requirements in real-time
    if (name === 'password') {
      setPasswordRequirements(prev =>
        prev.map(req => ({
          ...req,
          met: req.regex.test(value)
        }))
      );
    }
  };

  const validateForm = () => {
    return passwordRequirements.every(req => req.met) && 
           formData.password === formData.confirmPassword &&
           formData.firstName && 
           formData.lastName && 
           /\S+@\S+\.\S+/.test(formData.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email
      }));

      // Navigate to home page
      navigate('/');
      window.location.reload(); // Reload to update the auth state

    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconButton
          onClick={() => navigate('/')}
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            value={formData.firstName}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={formData.lastName}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password Requirements List */}
          <Box sx={{ mt: 1, mb: 2 }}>
            {passwordRequirements.map((req, index) => (
              <Stack 
                key={index} 
                direction="row" 
                spacing={1} 
                alignItems="center"
                sx={{ 
                  color: req.met ? 'success.main' : 'text.secondary',
                  fontSize: '0.75rem',
                  mb: 0.5
                }}
              >
                {req.met ? 
                  <CheckCircleIcon color="success" sx={{ fontSize: '1rem' }} /> : 
                  <CancelIcon color="action" sx={{ fontSize: '1rem' }} />
                }
                <Typography variant="caption">
                  {req.label}
                </Typography>
              </Stack>
            ))}
          </Box>

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !validateForm()}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
            <Link 
              component="button"
              variant="body1"
              onClick={() => navigate('/login')}
              sx={{ 
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Already have an account? Log in
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
