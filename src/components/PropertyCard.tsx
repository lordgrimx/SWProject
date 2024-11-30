import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box, Chip } from '@mui/material';
import { Favorite, FavoriteBorder, LocationOn } from '@mui/icons-material';
import { Property } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { AdvancedImage } from '@cloudinary/react';
import { cld, DEFAULT_IMAGES, getOptimizedImageUrl } from '../utils/cloudinary';

// Güvenilir varsayılan resimler


interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const { user, updateFavorites } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (user) {
      setIsFavorite(user.favorites.includes(property._id));
    }
  }, [user, property._id]);

  useEffect(() => {
    setImageUrl(getPropertyImage());
  }, [property.images]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      if (isFavorite) {
        await userService.removeUserFavorite(property._id);
      } else {
        await userService.addUserFavorite(property._id);
      }
      
      await updateFavorites(property._id, !isFavorite);
      setIsFavorite(!isFavorite);
      
      if (onFavoriteToggle) {
        onFavoriteToggle();
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleCardClick = () => {
    navigate(`/properties/${property._id}`);
  };

  const getPropertyImage = () => {
    if (imageError || !property.images || property.images.length === 0) {
      const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
      return DEFAULT_IMAGES[randomIndex];
    }

    const firstImage = property.images[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    } else {
      if (firstImage.url) {
        return firstImage.url;
      } else if (firstImage.public_id) {
        return getOptimizedImageUrl(firstImage.public_id);
      }
    }

    return DEFAULT_IMAGES[0];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card 
      onClick={handleCardClick}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {imageUrl && (
          <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-48 object-cover"
          onError={() => {
            setImageError(true);
            setImageUrl(DEFAULT_IMAGES[0]);
          }}
        />
        )}
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'white',
            '&:hover': { bgcolor: 'white' }
          }}
        >
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Chip
          label={property.status === 'for-sale' ? 'Satılık' : 'Kiralık'}
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {property.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {property.location.address}, {property.location.city}
          </Typography>
        </Box>

        <Typography variant="h6" color="primary" gutterBottom>
          {formatPrice(property.price)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          <Chip 
            label={`${property.features.bedrooms} Yatak Odası`}
            size="small"
            variant="outlined"
          />
          <Chip 
            label={`${property.features.bathrooms} Banyo`}
            size="small"
            variant="outlined"
          />
          <Chip 
            label={`${property.features.area}m²`}
            size="small"
            variant="outlined"
          />
        </Box>

        {property.specifications && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            {property.specifications.floor && (
              <Chip 
                label={`${property.specifications.floor}. Kat`}
                size="small"
                variant="outlined"
              />
            )}
            {property.specifications.heating && (
              <Chip 
                label={property.specifications.heating}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
