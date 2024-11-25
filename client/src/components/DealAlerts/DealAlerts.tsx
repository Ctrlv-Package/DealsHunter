import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, TextField, Select, MenuItem, FormControl, InputLabel, Button, Chip, Card, CardContent, IconButton, Stack, Alert, Snackbar } from '@mui/material';
import { AddAlert, Close, Notifications, Search, TrendingUp, ArrowBack } from '@mui/icons-material';
import './DealAlerts.css';

interface DealAlert {
  id?: string;
  title: string;
  keywords: string[];
  forum?: string;
  notificationMethods: string[];
  frequency: string;
  rating: string;
  isActive?: boolean;
  matchCount?: number;
  lastNotified?: Date;
}

const DealAlerts: React.FC = () => {
  const navigate = useNavigate();
  const [showDismissed, setShowDismissed] = useState(true);
  const [alertForm, setAlertForm] = useState<DealAlert>({
    title: '',
    keywords: [],
    forum: 'Hot Deals',
    notificationMethods: ['Email'],
    frequency: 'Instant',
    rating: 'Any'
  });
  const [keyword, setKeyword] = useState('');
  const [alerts, setAlerts] = useState<DealAlert[]>([]);
  const [popularKeywords, setPopularKeywords] = useState<{ _id: string; count: number }[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's alerts
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/alerts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }

      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch popular keywords
  const fetchPopularKeywords = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/alerts/popular');
      if (!response.ok) {
        throw new Error('Failed to fetch popular keywords');
      }

      const data = await response.json();
      setPopularKeywords(data);
    } catch (err) {
      console.error('Error fetching popular keywords:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchPopularKeywords();
  }, []);

  const handleAddKeyword = () => {
    if (keyword && !alertForm.keywords.includes(keyword)) {
      setAlertForm(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }));
      setKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setAlertForm(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keywordToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (alertForm.keywords.length > 0) {
      try {
        const response = await fetch('http://localhost:3001/api/alerts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(alertForm),
        });

        if (!response.ok) {
          throw new Error('Failed to create alert');
        }

        const newAlert = await response.json();
        setAlerts(prev => [...prev, newAlert]);
        setAlertForm({
          title: '',
          keywords: [],
          forum: 'Hot Deals',
          notificationMethods: ['Email'],
          frequency: 'Instant',
          rating: 'Any'
        });
        setSnackbarMessage('Deal alert created successfully!');
        setOpenSnackbar(true);
      } catch (err) {
        console.error('Error creating alert:', err);
        setSnackbarMessage('Failed to create deal alert');
        setOpenSnackbar(true);
      }
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete alert');
      }

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      setSnackbarMessage('Alert deleted successfully');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error deleting alert:', err);
      setSnackbarMessage('Failed to delete alert');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="lg" className="deal-alerts-container">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
        variant="text"
        color="primary"
      >
        Back to Deals
      </Button>

      {showDismissed && (
        <Alert 
          severity="info" 
          onClose={() => setShowDismissed(false)}
          className="welcome-alert"
        >
          <Typography variant="h6">Tired of missing out on great deals?</Typography>
          Tell us what you want to buy and we'll send you great deals that match!
        </Alert>
      )}

      <Paper elevation={3} className="alert-form-container">
        <Typography variant="h5" gutterBottom className="section-title">
          <AddAlert /> Add a Custom Deal Alert
        </Typography>

        <Box className="search-section">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for keywords, stores, brands or categories"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
            InputProps={{
              startAdornment: <Search className="search-icon" />,
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddKeyword}
            disabled={!keyword}
            className="add-keyword-btn"
          >
            Add Keyword
          </Button>
        </Box>

        <Box className="keywords-container">
          {alertForm.keywords.map((kw) => (
            <Chip
              key={kw}
              label={kw}
              onDelete={() => handleRemoveKeyword(kw)}
              className="keyword-chip"
            />
          ))}
        </Box>

        <Stack spacing={3} className="form-fields">
          <TextField
            fullWidth
            label="Title / Short Name (optional)"
            value={alertForm.title}
            onChange={(e) => setAlertForm(prev => ({ ...prev, title: e.target.value }))}
          />

          <FormControl fullWidth>
            <InputLabel id="target-forum-label">Target Forum</InputLabel>
            <Select
              labelId="target-forum-label"
              label="Target Forum"
              value={alertForm.forum}
              onChange={(e) => setAlertForm(prev => ({ ...prev, forum: e.target.value }))}
            >
              <MenuItem value="Hot Deals">Hot Deals</MenuItem>
              <MenuItem value="All Deals">All Deals</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="notification-method-label">Notification Method</InputLabel>
            <Select
              labelId="notification-method-label"
              label="Notification Method"
              multiple
              value={alertForm.notificationMethods}
              onChange={(e) => setAlertForm(prev => ({ 
                ...prev, 
                notificationMethods: typeof e.target.value === 'string' 
                  ? [e.target.value] 
                  : e.target.value 
              }))}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="Email">Email</MenuItem>
              <MenuItem value="Mobile Push Notification">Mobile Push Notification</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="frequency-label">Frequency</InputLabel>
            <Select
              labelId="frequency-label"
              label="Frequency"
              value={alertForm.frequency}
              onChange={(e) => setAlertForm(prev => ({ ...prev, frequency: e.target.value }))}
            >
              <MenuItem value="Instant">Instant</MenuItem>
              <MenuItem value="Daily">Daily Digest</MenuItem>
              <MenuItem value="Weekly">Weekly Digest</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="rating-label">Minimum Rating</InputLabel>
            <Select
              labelId="rating-label"
              label="Minimum Rating"
              value={alertForm.rating}
              onChange={(e) => setAlertForm(prev => ({ ...prev, rating: e.target.value }))}
            >
              <MenuItem value="Any">Any Rating</MenuItem>
              <MenuItem value="1+">1+ Stars</MenuItem>
              <MenuItem value="2+">2+ Stars</MenuItem>
              <MenuItem value="3+">3+ Stars</MenuItem>
              <MenuItem value="4+">4+ Stars</MenuItem>
              <MenuItem value="5+">5+ Stars</MenuItem>
              <MenuItem value="Popular">Popular</MenuItem>
              <MenuItem value="FP">Front Page</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={alertForm.keywords.length === 0 || loading}
            className="submit-btn"
            fullWidth
          >
            {loading ? 'Adding...' : 'Add Alert'}
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={3} className="alerts-list-container">
        <Typography variant="h6" gutterBottom className="section-title">
          <Notifications /> Your Deal Alert Matches
        </Typography>
        {loading ? (
          <Typography align="center">Loading your alerts...</Typography>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : alerts.length === 0 ? (
          <Typography color="textSecondary" className="no-alerts">
            You haven't created any deal alerts yet
          </Typography>
        ) : (
          alerts.map(alert => (
            <Card key={alert.id} className="alert-card">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Typography variant="h6">{alert.title || 'Unnamed Alert'}</Typography>
                    <Box className="keywords-display">
                      {alert.keywords.map(kw => (
                        <Chip key={kw} label={kw} size="small" />
                      ))}
                    </Box>
                    {alert.matchCount !== undefined && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Matches found: {alert.matchCount}
                      </Typography>
                    )}
                  </div>
                  <IconButton 
                    onClick={() => alert.id && handleDeleteAlert(alert.id)}
                    size="small"
                  >
                    <Close />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Paper>

      <Paper elevation={3} className="popular-alerts-container">
        <Typography variant="h6" gutterBottom className="section-title">
          <TrendingUp /> Most Popular Deal Alerts
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {popularKeywords.map(({ _id, count }) => (
            <Chip
              key={_id}
              label={`${_id} (${count})`}
              onClick={() => {
                setKeyword(_id);
                handleAddKeyword();
              }}
              className="keyword-chip"
            />
          ))}
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default DealAlerts;
