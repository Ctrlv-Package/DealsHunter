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
import { Deal } from '../types/Deal';

interface DealCardProps {
  deal: Deal;
}

const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const discount = Math.round(
    ((parseFloat(deal.originalPrice) - parseFloat(deal.price)) / parseFloat(deal.originalPrice)) * 100
  );

  return (
    <Card 
      className="deal-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={deal.image}
          alt={deal.title}
          loading="lazy"
          sx={{
            objectFit: 'contain',
            backgroundColor: '#f5f5f5',
            p: 2
          }}
        />
        <Chip
          icon={<LocalOfferIcon />}
          label={`${discount}% OFF`}
          color="error"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontWeight: 'bold'
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.2,
            mb: 1,
            height: '2.4em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {deal.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: 'bold',
              mr: 1
            }}
          >
            ${deal.price}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textDecoration: 'line-through'
            }}
          >
            ${deal.originalPrice}
          </Typography>
        </Box>

        {deal.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              height: '3em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {deal.description}
          </Typography>
        )}

        <Box sx={{ mt: 'auto' }}>
          <Chip
            icon={<StoreIcon />}
            label={deal.retailer}
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            fullWidth
            href={deal.productUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Deal
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DealCard;
