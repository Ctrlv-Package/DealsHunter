import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Collapse,
  Card,
  CardContent,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';

const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showBanner, setShowBanner] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const popularAlerts = [
    'Deal of the Day',
    'Best Amazon Deals',
    'Laptop',
    'Lego',
    'Tablet',
    'TV',
    'Xbox One',
    'PS4',
    'Nintendo Switch',
  ];

  const categories = [
    {
      title: 'Home Supplies',
      description: 'Restock your home essentials without paying retail.',
      alerts: ['Home Chef', 'Blender', 'Sous Vide', 'Instant Pot', 'Paper Towel', 'Knives', 'Oven', 'Cutting Boards'],
    },
    {
      title: 'Credit Cards',
      description: 'Get notified on Credit Card deals with the best sign-up and bonus offers.',
      alerts: [],
    },
    {
      title: 'Games',
      description: '',
      alerts: ['Xbox One', 'PS4', 'Nintendo Switch', 'Gaming Computer', 'Board Games'],
    },
    {
      title: 'Video Games',
      description: 'Xbox, Playstation, PC, and Nintendo Switch. Get alerts for all our very best video game deals.',
      alerts: [],
    },
    {
      title: 'Fast Food & Restaurants',
      description: 'Our hottest deals for dining out delivered to your inbox.',
      alerts: [],
    },
    {
      title: 'Smarten up your home',
      description: '',
      alerts: ['Security Cameras', 'Echo Devices', 'Google Home', 'Smart Lights', 'Thermostats', 'Philips Hue'],
    },
    {
      title: 'Travel',
      description: 'Pack your bags and get ready to fly with our best travel deals.',
      alerts: [],
    },
    {
      title: 'Living Room Essentials',
      description: '',
      alerts: ['4K TV', 'OLED TV', 'Sound Bars', 'Wall Mounts', 'Apple TV', 'Roku', 'Amazon Fire TV', 'Logitech Harmony'],
    },
    {
      title: 'Build your own PC',
      description: '',
      alerts: ['Motherboard', 'Video Card', 'SSD Internal Hard Drive', 'Computer Case', 'CPU', 'Ram / Memory', 'Power Supplies'],
    },
    {
      title: 'Clothing and Accessories',
      description: '',
      alerts: [
        'Men\'s Clothing and Accessories',
        'Women\'s Clothing and Accessories',
        'Kids Clothing and Accessories',
        'Men\'s Shoes',
        'Women\'s Shoes',
        'Kids Shoes',
      ],
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      py: 3,
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          gap: 2,
        }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
              },
            }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Deal Alerts
          </Typography>
        </Box>

        {/* Banner */}
        <Collapse in={showBanner}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 4, 
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid',
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <NotificationsIcon color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" sx={{ mb: 0.5 }}>Stay Updated on Deals</Typography>
                <Typography variant="body1" color="text.secondary">
                  Tell us what you want to buy and we'll send you great deals that match!
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={() => setShowBanner(false)}
              sx={{ 
                '&:hover': { 
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Paper>
        </Collapse>

        {/* Custom Alert Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Add a Custom Deal Alert</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for keywords, stores, brands or categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="text"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              endIcon={showMoreOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ fontWeight: 500 }}
            >
              More Options
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Add Alert
            </Button>
          </Box>
        </Paper>

        {/* Matches Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Your Deal Alert Matches</Typography>
          <Typography variant="body1" color="text.secondary">
            We haven't found any matches for your deal alerts yet
          </Typography>
        </Paper>

        {/* Deal of the Day Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) => alpha(theme.palette.warning.main, 0.05),
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Deal of the Day</Typography>
          <Typography variant="body1" gutterBottom color="text.secondary">
            Get alerts on the very best, ultimate, hottest Slickdeals.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              bgcolor: theme.palette.warning.main,
              '&:hover': {
                bgcolor: theme.palette.warning.dark,
              }
            }}
          >
            Add Deal Alert
          </Button>
        </Paper>

        {/* Most Popular Alerts */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Most Popular Deal Alerts</Typography>
          <Grid container spacing={2}>
            {popularAlerts.map((alert) => (
              <Grid item xs={12} sm={6} md={4} key={alert}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 1,
                    }
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{alert}</Typography>
                    <Button 
                      variant="text" 
                      startIcon={<AddIcon />}
                      sx={{ 
                        mt: 1,
                        textTransform: 'none',
                      }}
                    >
                      Add Deal Alert
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Category Sections */}
        {categories.map((category) => (
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 4,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }} 
            key={category.title}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>{category.title}</Typography>
            {category.description && (
              <Typography variant="body1" gutterBottom color="text.secondary">{category.description}</Typography>
            )}
            <Grid container spacing={2}>
              {category.alerts.map((alert) => (
                <Grid item xs={12} sm={6} md={4} key={alert}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 1,
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>{alert}</Typography>
                      <Button 
                        variant="text" 
                        startIcon={<AddIcon />}
                        sx={{ 
                          mt: 1,
                          textTransform: 'none',
                        }}
                      >
                        Add Deal Alert
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}
      </Container>
    </Box>
  );
};

export default AlertsPage;
