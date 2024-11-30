export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  favorites: string[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PropertyImage {
  url: string;
  id: string;
  public_id?: string;
  filename?: string;
  format?: string;
  resource_type?: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  coordinates?: Coordinates;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt?: number;
  floor?: number;
  heating?: string;
  dues?: number;
}

export interface PropertySpecifications {
  constructionYear?: number;
  totalFloors?: number;
  floor?: number;
  heating?: 'natural gas' | 'electric' | 'solar' | 'other';
  facade?: string;
  furnished?: boolean;
  usageStatus?: 'empty' | 'tenant' | 'owner';
  eligible?: boolean;
  swap?: boolean;
  titleDeedStatus?: 'ready' | 'under construction' | 'cooperative';
}

export interface NearbyPlace {
  name: string;
  type: string;
  distance: number;
}

export interface PropertyAgent {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'agent' | 'admin';
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  location: PropertyLocation;
  features: PropertyFeatures;
  specifications?: PropertySpecifications;
  images: (string | PropertyImage)[];
  propertyType: 'house' | 'apartment' | 'condo' | 'villa' | 'land';
  yearBuilt?: number;
  owner: string;
  agent: Agent;
  views: number;
  favorites: string[];
  virtualTour?: string;
  floorPlan?: string;
  amenities?: string[];
  nearbyPlaces?: NearbyPlace[];
  energyRating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  availability?: Date;
  lastUpdated?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface PropertyData {
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  type: 'house' | 'apartment' | 'villa';
  status: 'for-sale' | 'for-rent';
  features: string[];
  specifications: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt: number;
  };
  images: string[];
}

export interface PropertyQueryParams {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  city?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  results?: number;
}
