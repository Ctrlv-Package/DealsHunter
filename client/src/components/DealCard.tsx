import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { LocalOffer as LocalOfferIcon, Store as StoreIcon } from '@mui/icons-material';

interface DealCardProps {
  deal: {
    _id: string;
    title: string;
    price: string;
    originalPrice: string;
    description: string;
    image: string;
    productUrl: string;
    retailer: string;
  };
}

const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const discount = Math.round(
    ((parseFloat(deal.originalPrice) - parseFloat(deal.price)) / parseFloat(deal.originalPrice)) * 100
  );

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      {discount > 0 && (
        <Chip
          label={`-${discount}%`}
          color="error"
          size="small"
          icon={<LocalOfferIcon />}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
          }}
        />
      )}
      <CardMedia
        component="img"
        image={deal.image}
        alt={deal.title}
        sx={{
          height: 200,
          objectFit: 'contain',
          backgroundColor: '#f5f5f5',
          p: 2,
        }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            height: '2.8em',
          }}
        >
          {deal.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <StoreIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {deal.retailer}
          </Typography>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              ${parseFloat(deal.price).toFixed(2)}
            </Typography>
            {parseFloat(deal.originalPrice) > parseFloat(deal.price) && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${parseFloat(deal.originalPrice).toFixed(2)}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            href={deal.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            View Deal
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DealCard;
