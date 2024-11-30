import React from 'react';
import { MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface LocationDisplayProps {
  address: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({
  address,
  city,
  state,
  coordinates,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start space-x-3">
        <MapPinIcon className="h-6 w-6 text-blue-500 mt-1" />
        <div>
          <h3 className="font-semibold text-lg mb-2">Property Location</h3>
          <div className="space-y-2 text-gray-600">
            <p className="flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400" />
              {address}
            </p>
            <p className="ml-7">{city}, {state}</p>
            {coordinates && (
              <p className="ml-7 text-sm text-gray-500">
                {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDisplay;
