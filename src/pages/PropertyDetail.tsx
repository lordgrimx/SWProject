import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Property, PropertyImage } from '../types';
import { LocationOn, Person, Phone, Email } from '@mui/icons-material';
import MapView from '../components/MapView';

const defaultCenter = { lat: 41.0082, lng: 28.9784 }; // Istanbul center

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/properties/${id}`);
        setProperty(response.data);
        setLoading(false);
      } catch (err) {
        setError('Property not found');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!property) return <div className="text-center py-8">Property not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
        {/* Main Image */}
        <div className="relative">
          <img
            src={typeof property.images[0] === 'string' 
              ? property.images[0] 
              : property.images[0]?.url || '/placeholder-house.jpg'}
            alt={property.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Thumbnail Images */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {property.images.slice(1).map((image, index) => (
            <img
              key={index}
              src={typeof image === 'string' ? image : image.url}
              alt={`${property.title} ${index + 2}`}
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          
          <div className="flex items-center mb-4">
            <LocationOn className="text-gray-500 mr-2" />
            <p className="text-gray-600">
              {property.location.address}, {property.location.city}
            </p>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Özellikler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-500">Yatak Odası</p>
                <p className="text-xl font-semibold">{property.features.bedrooms}</p>
              </div>
              <div>
                <p className="text-gray-500">Banyo</p>
                <p className="text-xl font-semibold">{property.features.bathrooms}</p>
              </div>
              <div>
                <p className="text-gray-500">Alan</p>
                <p className="text-xl font-semibold">{property.features.area} m²</p>
              </div>
              {property.features.yearBuilt && (
                <div>
                  <p className="text-gray-500">Yapım Yılı</p>
                  <p className="text-xl font-semibold">{property.features.yearBuilt}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Features */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-2">Diğer Özellikler</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(property.features)
                .filter(([key, value]) => typeof value === 'boolean' && value)
                .map(([feature], index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>{feature}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Açıklama</h2>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Konum</h2>
            <p className="text-gray-600 mb-4">{property.location.address}</p>
            <MapView
              properties={[{
                ...property,
                location: {
                  ...property.location,
                  coordinates: {
                    lat: property.location.coordinates?.lat ?? defaultCenter.lat,
                    lng: property.location.coordinates?.lng ?? defaultCenter.lng
                  }
                }
              }]}
              defaultCenter={defaultCenter}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(property.price)}
            </h2>
            <p className="text-gray-600 mb-4">
              {property.status === 'for-sale' ? 'Satılık' : 'Kiralık'}
            </p>
          </div>

          {/* Agent Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Emlakçı Bilgileri</h2>
            <div className="flex items-start space-x-4">
              <img
                src={property.agent.avatar || '/default-avatar.png'}
                alt={property.agent.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Person className="text-gray-500" />
                  <p className="font-semibold">{property.agent.name}</p>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Email className="text-gray-500" />
                  <p className="text-gray-600">{property.agent.email}</p>
                </div>
                {property.agent.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="text-gray-500" />
                    <p className="text-gray-600">{property.agent.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
