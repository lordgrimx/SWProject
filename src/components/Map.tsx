import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
  }>;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  height?: string;
}

const Map: React.FC<MapProps> = ({
  center,
  zoom = 12,
  markers = [],
  onClick,
  height = '400px',
}) => {
  const mapStyles = {
    height,
    width: '100%',
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  console.log('Google Maps API key:', apiKey);
  if (!apiKey) {
    console.error('Google Maps API key is missing');
    return <div className="bg-gray-100 p-4 rounded">Map not available</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={zoom}
        center={center}
        onClick={onClick}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
