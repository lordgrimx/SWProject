import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Property, Coordinates } from '../types';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocationOn } from '@mui/icons-material';

interface MapViewProps {
  properties: Property[];
  defaultCenter?: Coordinates;
}

const MapView: React.FC<MapViewProps> = ({ properties, defaultCenter = { lat: 41.0082, lng: 28.9784 } }) => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);

  const mapStyles = {
    height: "70vh",
    width: "100%"
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Haritanın merkezini ilk property'nin konumuna göre ayarla
  const mapCenter = React.useMemo(() => {
    if (properties.length > 0 && properties[0].location.coordinates) {
      return {
        lat: properties[0].location.coordinates.lat,
        lng: properties[0].location.coordinates.lng
      };
    }
    return defaultCenter;
  }, [properties, defaultCenter]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={mapCenter}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {properties.map(property => {
          if (!property.location.coordinates) return null;
          
          return (
            <Marker
              key={property._id}
              position={{
                lat: property.location.coordinates.lat,
                lng: property.location.coordinates.lng
              }}
              onClick={() => setSelectedProperty(property)}
            />
          );
        })}

        {selectedProperty && selectedProperty.location.coordinates && (
          <InfoWindow
            position={{
              lat: selectedProperty.location.coordinates.lat,
              lng: selectedProperty.location.coordinates.lng
            }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <Card 
              sx={{ 
                maxWidth: 300, 
                cursor: 'pointer',
                boxShadow: 'none'
              }} 
              onClick={() => navigate(`/properties/${selectedProperty._id}`)}
            >
              <Box sx={{ position: 'relative' }}>
                <img
                  src={selectedProperty.images[0] ? 
                    (typeof selectedProperty.images[0] === 'string' 
                      ? selectedProperty.images[0] 
                      : selectedProperty.images[0].url) 
                    : '/placeholder-house.jpg'}
                  alt={selectedProperty.title}
                  style={{ 
                    width: '100%', 
                    height: 150, 
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
                <Chip
                  label={selectedProperty.status === 'for-sale' ? 'Satılık' : 'Kiralık'}
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8
                  }}
                />
              </Box>

              <CardContent>
                <Typography variant="h6" component="div" noWrap>
                  {selectedProperty.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {selectedProperty.location.address}
                  </Typography>
                </Box>

                <Typography variant="h6" color="primary" gutterBottom>
                  {formatPrice(selectedProperty.price)}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${selectedProperty.features.bedrooms} Yatak Odası`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    label={`${selectedProperty.features.bathrooms} Banyo`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    label={`${selectedProperty.features.area}m²`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapView;
