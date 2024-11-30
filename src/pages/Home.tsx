import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Find Your Dream Home
        </h1>
        
        {/* Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Property Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
            </select>
            <button className="btn-primary">
              Search Properties
            </button>
          </div>
        </div>

        {/* Featured Properties */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {/* Image will go here */}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">Modern Apartment</h3>
                <p className="text-gray-600">New York, NY</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-primary font-semibold">$2,500/mo</span>
                  <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
