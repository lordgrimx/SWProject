import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Property, PropertyImage } from '../types';
import { propertyService } from '../services/api';
import LocationDisplay from '../components/LocationDisplay';
import { useAuth } from '../contexts/AuthContext';
import { AdvancedImage } from '@cloudinary/react';
import { cld, DEFAULT_IMAGES, getOptimizedImageUrl } from '../utils/cloudinary';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  const getPropertyImage = (image: string | PropertyImage, index: number) => {
    if (imageError[index] || !image) {
      return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
    }

    if (typeof image === 'string') {
      return image;
    } else {
      if (image.url) {
        return image.url;
      } else if (image.public_id) {
        return getOptimizedImageUrl(image.public_id);
      }
    }
    
    return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertyService.getById(id!);
        setProperty(response.data);
        setIsFavorite(user?.favorites.includes(id!) || false);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, user]);

  useEffect(() => {
    if (property?.images && property.images.length > 0) {
      setSelectedImage(getPropertyImage(property.images[0], 0));
    }
  }, [property]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!property) {
    return <div className="text-center py-8">Property not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="relative h-96 w-full overflow-hidden rounded-lg">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={() => {
                  setImageError(prev => ({ ...prev, [0]: true }));
                  setSelectedImage(DEFAULT_IMAGES[0]);
                }}
              />
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {property.images.map((image, index) => (
              <button
                key={index}
                className={`relative h-24 overflow-hidden rounded-lg ${
                  selectedImage === getPropertyImage(image, index) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedImage(getPropertyImage(image, index))}
              >
                <img
                  src={getPropertyImage(image, index)}
                  alt={`${property.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => {
                    setImageError(prev => ({ ...prev, [index]: true }));
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="text-gray-500 mt-2">{property.location.address}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-blue-600">
              ${property.price.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xl font-semibold">{property.features.bedrooms}</p>
              <p className="text-gray-500">Bedrooms</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xl font-semibold">{property.features.bathrooms}</p>
              <p className="text-gray-500">Bathrooms</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xl font-semibold">{property.features.area}</p>
              <p className="text-gray-500">Sq Ft</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{property.description}</p>
          </div>

          <LocationDisplay 
            address={property.location.address}
            city={property.location.city}
            state={property.location.state}
            coordinates={property.location.coordinates}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
