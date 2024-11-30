import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Property services
export const propertyService = {
  getAll: (params?: any) => api.get('/properties', { params }),
  getById: (id: string) => api.get(`/properties/${id}`),
  create: (data: any) => api.post('/properties', data),
  update: (id: string, data: any) => api.put(`/properties/${id}`, data),
  delete: (id: string) => api.delete(`/properties/${id}`),
  toggleFavorite: (id: string) => api.post(`/properties/${id}/favorite`),
};

// User services
export const userService = {
  getFavorites: () => api.get('/users/favorites'),
  getSearchHistory: () => api.get('/users/search-history'),
  addSearchHistory: (searchData: any) => api.post('/users/search-history', searchData),
  addUserFavorite: (propertyId: string) => api.post(`/users/favorites/${propertyId}`),
  removeUserFavorite: (propertyId: string) => api.delete(`/users/favorites/${propertyId}`),
};

export default api;
