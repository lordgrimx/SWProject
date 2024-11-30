import { Request } from 'express';
import { Types } from 'mongoose';

export interface PropertyImage {
  url: string;
  public_id: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: boolean;
  furnished: boolean;
  airConditioning: boolean;
  heating: boolean;
  balcony: boolean;
  garden: boolean;
  pool: boolean;
  security: boolean;
}

export interface PropertySpecifications {
  constructionYear?: number;
  totalFloors?: number;
  floor?: number;
  heating?: 'natural gas' | 'electric' | 'solar' | 'other';
  facade?: string;
  furnished?: boolean;
  usageStatus?: 'empty' | 'tenant' | 'owner';
  dues?: number;
  eligible?: boolean;
  swap?: boolean;
  titleDeedStatus?: 'ready' | 'under construction' | 'cooperative';
}

export interface NearbyPlace {
  name: string;
  type: string;
  distance: number;
}

export type PropertyType = 'house' | 'apartment' | 'condo' | 'villa' | 'land';
export type PropertyStatus = 'for-sale' | 'for-rent' | 'sold' | 'rented';

export interface Property {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  location: PropertyLocation;
  features: PropertyFeatures;
  specifications: PropertySpecifications;
  images: PropertyImage[];
  propertyType: PropertyType;
  status: PropertyStatus;
  yearBuilt?: number;
  owner: Types.ObjectId;
  views: number;
  favorites: Types.ObjectId[];
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

export interface User {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  favorites?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}
