import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Switch,
  FormGroup,
  FormControlLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface PriceAlert {
  _id: string;
  productName: string;
  targetPrice: number;
  active: boolean;
}

interface UserProfile {
  email: string;
  name: string;
  bio: string;
  preferences: {
    emailNotifications: {
      dealAlerts: boolean;
      priceDrops: boolean;
      weeklyNewsletter: boolean;
    };
    dealCategories: string[];
    priceAlerts: PriceAlert[];
    displayCurrency: string;
    theme: string;
  };
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface UserProfilePageProps {
  user: User | null;
}

const DEAL_CATEGORIES = [
  'Electronics', 'Fashion', 'Home', 'Beauty', 
  'Sports', 'Books', 'Toys', 'Other'
];

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<PriceAlert>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
    fetchPriceAlerts();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      // User data is now passed as a prop, no need to set it here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceAlerts = async () => {
    try {
      const response = await fetch('/api/alerts', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch price alerts');
      const data = await response.json();
      setPriceAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateAlert = async () => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newAlert)
      });
      
      if (!response.ok) throw new Error('Failed to create alert');
      
      const createdAlert = await response.json();
      setPriceAlerts([...priceAlerts, createdAlert]);
      setOpenDialog(false);
      setNewAlert({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to delete alert');
      
      setPriceAlerts(priceAlerts.filter(alert => alert._id !== alertId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ mt: 8, p: 4, position: 'relative' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          
          <Typography component="h1" variant="h4" gutterBottom>
            {user?.firstName} {user?.lastName}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {user?.email}
          </Typography>

          <Divider sx={{ width: '100%', my: 3 }} />

          <Box sx={{ width: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Price Alerts</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Add Alert
              </Button>
            </Box>

            {priceAlerts.length === 0 ? (
              <Typography color="text.secondary" align="center">
                No price alerts set
              </Typography>
            ) : (
              <List>
                {priceAlerts.map((alert) => (
                  <ListItem
                    key={alert._id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleDeleteAlert(alert._id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={alert.productName}
                      secondary={`Target Price: $${alert.targetPrice}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Create Price Alert</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Product Name"
                fullWidth
                value={newAlert.productName || ''}
                onChange={(e) => setNewAlert({ ...newAlert, productName: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Target Price"
                type="number"
                fullWidth
                value={newAlert.targetPrice || ''}
                onChange={(e) => setNewAlert({ ...newAlert, targetPrice: parseFloat(e.target.value) })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateAlert} variant="contained">
                Create
              </Button>
            </DialogActions>
          </Dialog>
      </Paper>
    </Container>
  );
};

export default UserProfilePage;
