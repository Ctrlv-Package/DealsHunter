import React, { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Paper,
  Typography,
  Box,
  Divider
} from '@mui/material';
import {
  Smartphone,
  SportsEsports,
  Home,
  Weekend,
  Checkroom,
  SportsBasketball,
  LocalOffer,
  Category,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categoryGroups = {
  'Electronics': [
    'Smartphones',
    'Laptops',
    'TVs',
    'Audio',
    'Cameras',
    'Accessories'
  ],
  'Gaming': [
    'Consoles',
    'Video Games',
    'Gaming PCs',
    'Accessories',
    'VR',
    'Gaming Chairs'
  ],
  'Appliances': [
    'Kitchen',
    'Laundry',
    'Refrigerators',
    'Dishwashers',
    'Air Conditioners',
    'Vacuums'
  ],
  'Home & Garden': [
    'Furniture',
    'Decor',
    'Kitchen',
    'Bedding',
    'Garden Tools',
    'Lighting'
  ],
  'Fashion': [
    'Men\'s Clothing',
    'Women\'s Clothing',
    'Shoes',
    'Accessories',
    'Jewelry',
    'Watches'
  ],
  'Sports & Outdoors': [
    'Exercise Equipment',
    'Outdoor Recreation',
    'Sports Gear',
    'Camping',
    'Fishing',
    'Cycling'
  ]
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Electronics':
      return <Smartphone />;
    case 'Gaming':
      return <SportsEsports />;
    case 'Appliances':
      return <Home />;
    case 'Home & Garden':
      return <Weekend />;
    case 'Fashion':
      return <Checkroom />;
    case 'Sports & Outdoors':
      return <SportsBasketball />;
    default:
      return <Category />;
  }
};

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

  const handleCategoryClick = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
    onSelectCategory(category);
  };

  const handleSubcategoryClick = (subcategory: string) => {
    onSelectCategory(subcategory);
  };

  return (
    <Paper
      elevation={2}
      className="category-sidebar"
      sx={{
        width: 280,
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Categories
        </Typography>
      </Box>
      <List component="nav" sx={{ p: 1 }}>
        <ListItemButton
          selected={selectedCategory === 'All'}
          onClick={() => onSelectCategory('All')}
          sx={{ borderRadius: 1, mb: 1 }}
        >
          <ListItemIcon>
            <LocalOffer />
          </ListItemIcon>
          <ListItemText primary="All Deals" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        {Object.entries(categoryGroups).map(([category, subcategories]) => (
          <React.Fragment key={category}>
            <ListItemButton
              onClick={() => handleCategoryClick(category)}
              selected={selectedCategory === category}
              sx={{ 
                borderRadius: 1,
                mb: 0.5,
                backgroundColor: selectedCategory === category ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                {getCategoryIcon(category)}
              </ListItemIcon>
              <ListItemText 
                primary={category}
                primaryTypographyProps={{
                  fontWeight: selectedCategory === category ? 600 : 400
                }}
              />
              {openCategories[category] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openCategories[category]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {subcategories.map((subcategory) => (
                  <ListItemButton
                    key={subcategory}
                    selected={selectedCategory === subcategory}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    sx={{
                      pl: 4,
                      borderRadius: 1,
                      ml: 2,
                      my: 0.5,
                      backgroundColor: selectedCategory === subcategory ? 'action.selected' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemText 
                      primary={subcategory}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: selectedCategory === subcategory ? 600 : 400
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default CategorySidebar;
