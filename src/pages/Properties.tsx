import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Property } from '../types';
import { propertyService } from '../services/api';
import PropertySearch from '../components/PropertySearch';
import PropertyCard from '../components/PropertyCard';
import Map from '../components/Map';

const Properties: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const defaultLocation = {
    lat: 40.7128,
    lng: -74.0060,
  };

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(searchParams.entries());
      const response = await propertyService.getAll({ ...params, page });
      setProperties(response.data.properties);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSearch = (params: any) => {
    setPage(1);
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PropertySearch onSearch={handleSearch} className="mb-8" />

      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-lg border">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-l-lg ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-r-lg ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">Loading...</div>
      ) : viewMode === 'grid' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 border-r last:border-r-0 ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="h-[calc(100vh-400px)]">
          <Map
            center={{
              lat: properties.length > 0 ? (properties[0]?.location?.coordinates?.lat ?? defaultLocation.lat) : defaultLocation.lat,
              lng: properties.length > 0 ? (properties[0]?.location?.coordinates?.lng ?? defaultLocation.lng) : defaultLocation.lng,
            }}
            markers={properties.length > 0 ? properties.map((property) => ({
              lat: property.location?.coordinates?.lat !== undefined ? property.location.coordinates.lat : defaultLocation.lat,
              lng: property.location?.coordinates?.lng !== undefined ? property.location.coordinates.lng : defaultLocation.lng,
              title: property.title,
            })) : []}
          />
        </div>
      )}
    </div>
  );
};

export default Properties;
