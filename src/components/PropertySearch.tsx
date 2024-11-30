import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface PropertySearchProps {
  onSearch?: (params: any) => void;
  className?: string;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ onSearch, className = '' }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    search: '',
    type: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    city: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty values
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== '')
    );

    if (onSearch) {
      onSearch(filteredParams);
    } else {
      // Convert params to URL search params
      const queryString = new URLSearchParams(filteredParams).toString();
      navigate(`/properties?${queryString}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <input
            type="text"
            name="search"
            value={searchParams.search}
            onChange={handleChange}
            placeholder="Search properties..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Property Type */}
        <div>
          <select
            name="type"
            value={searchParams.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Property Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            name="status"
            value={searchParams.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Status</option>
            <option value="for-sale">For Sale</option>
            <option value="for-rent">For Rent</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <input
            type="number"
            name="minPrice"
            value={searchParams.minPrice}
            onChange={handleChange}
            placeholder="Min Price"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="number"
            name="maxPrice"
            value={searchParams.maxPrice}
            onChange={handleChange}
            placeholder="Max Price"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search Button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default PropertySearch;
