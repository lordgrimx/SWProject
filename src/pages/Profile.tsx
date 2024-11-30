import React, { useState, useEffect } from 'react';
import { Property, UpdateProfileData, SearchHistoryItem } from '../types';
import { propertyService, authService, userService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UpdateProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Get current user data
      const userResponse = await authService.getCurrentUser();
      const userData = userResponse.data;

      // Update profile state
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        avatar: userData.avatar || ''
      });

      // Get user's favorite properties
      if (userData.favorites && userData.favorites.length > 0) {
        const favoritesPromises = userData.favorites.map((id: string) =>
          propertyService.getById(id)
        );
        const favoritesResponses = await Promise.all(favoritesPromises);
        setFavorites(favoritesResponses.map(res => res.data));
      }

      // Get search history
      setSearchHistory(userData.searchHistory || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.updateProfile(profile);
      updateUser(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await userService.removeUserFavorite(propertyId);
      setFavorites(favorites.filter(fav => fav._id !== propertyId));
      propertyService.toggleFavorite(propertyId);
      //reload page
      window.location.reload();
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error removing property from favorites. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="container py-8 text-center">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['profile', 'favorites', 'history'].map((tab) => (
              <button
                key={tab}
                className={`${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium capitalize`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture
                </label>
                <div className="mt-2 flex items-center">
                  <div className="w-20 h-20 rounded-full bg-gray-200">
                    {profile.avatar && (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                  <input
                    type="text"
                    value={profile.avatar || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, avatar: e.target.value })
                    }
                    placeholder="Avatar URL"
                    className="ml-4 flex-1 px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="mt-1 block w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="mt-1 block w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="mt-1 block w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Profile
              </button>
            </form>
          )}

          {activeTab === 'favorites' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={typeof property.images[0] === 'string' ? property.images[0] : property.images[0].url}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{property.title}</h3>
                    <p className="text-gray-500">{property.location.address}</p>
                    <p className="text-xl font-bold text-blue-600 mt-2">
                      ${property.price.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemoveFavorite(property._id)}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Remove from Favorites
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {searchHistory.map((search, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{search.query}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(search.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
