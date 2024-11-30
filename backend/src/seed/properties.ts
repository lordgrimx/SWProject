import mongoose from 'mongoose';
import Property from '../models/Property';
import { config } from 'dotenv';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate';

const sampleProperties = [
  {
    title: 'Modern Villa with Pool',
    description: 'Luxurious modern villa with private pool and garden',
    price: 5500000,
    location: {
      address: 'Bahçelievler Mah. 123 Sok. No:45',
      city: 'İstanbul',
      state: 'Bahçelievler',
      coordinates: {
        lat: 41.0082,
        lng: 28.9784
      }
    },
    features: {
      bedrooms: 5,
      bathrooms: 3,
      area: 350,
      parking: true,
      furnished: true,
      airConditioning: true,
      heating: true,
      balcony: true,
      garden: true,
      pool: true,
      security: true
    },
    specifications: {
      constructionYear: 2020,
      totalFloors: 3,
      floor: 1,
      heating: 'natural gas',
      facade: 'South-East',
      furnished: true,
      usageStatus: 'empty',
      dues: 1500,
      eligible: true,
      swap: false,
      titleDeedStatus: 'ready'
    },
    images: [
      {
        url: 'https://res.cloudinary.com/dcjsorpmd/image/upload/v1/real-estate/villa1',
        public_id: 'real-estate/villa1'
      }
    ],
    propertyType: 'villa',
    status: 'for-sale',
    yearBuilt: 2020,
    owner: '65676c987d654321fedcba98', // Örnek bir MongoDB ObjectId
    views: 150,
    favorites: [],
    virtualTour: 'https://example.com/virtual-tour/villa1',
    floorPlan: 'https://example.com/floorplan/villa1',
    amenities: ['gym', 'swimming pool', 'parking', 'security'],
    nearbyPlaces: [
      {
        name: 'City Mall',
        type: 'shopping',
        distance: 1.5
      },
      {
        name: 'Central Park',
        type: 'park',
        distance: 0.8
      }
    ],
    energyRating: 'A'
  },
  {
    title: 'Central Apartment',
    description: 'Modern apartment in the heart of the city',
    price: 2200000,
    location: {
      address: 'Merkez Mah. 456 Sok. No:12',
      city: 'İstanbul',
      state: 'Şişli',
      coordinates: {
        lat: 41.0522,
        lng: 28.9892
      }
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 140,
      parking: true,
      furnished: false,
      airConditioning: true,
      heating: true,
      balcony: true,
      garden: false,
      pool: false,
      security: true
    },
    specifications: {
      constructionYear: 2018,
      totalFloors: 12,
      floor: 8,
      heating: 'natural gas',
      facade: 'West',
      furnished: false,
      usageStatus: 'empty',
      dues: 800,
      eligible: true,
      swap: true,
      titleDeedStatus: 'ready'
    },
    images: [
      {
        url: 'https://res.cloudinary.com/dcjsorpmd/image/upload/v1/real-estate/apartment1',
        public_id: 'real-estate/apartment1'
      }
    ],
    propertyType: 'apartment',
    status: 'for-sale',
    yearBuilt: 2018,
    owner: '65676c987d654321fedcba98',
    views: 89,
    favorites: [],
    virtualTour: 'https://example.com/virtual-tour/apartment1',
    floorPlan: 'https://example.com/floorplan/apartment1',
    amenities: ['parking', 'elevator', 'security'],
    nearbyPlaces: [
      {
        name: 'Metro Station',
        type: 'transportation',
        distance: 0.3
      },
      {
        name: 'Hospital',
        type: 'healthcare',
        distance: 1.2
      }
    ],
    energyRating: 'B'
  },
  {
    title: 'Seaside Condo',
    description: 'Beautiful condo with sea view',
    price: 3800000,
    location: {
      address: 'Sahil Mah. 789 Sok. No:34',
      city: 'İstanbul',
      state: 'Maltepe',
      coordinates: {
        lat: 40.9392,
        lng: 29.1311
      }
    },
    features: {
      bedrooms: 4,
      bathrooms: 2,
      area: 180,
      parking: true,
      furnished: true,
      airConditioning: true,
      heating: true,
      balcony: true,
      garden: false,
      pool: true,
      security: true
    },
    specifications: {
      constructionYear: 2019,
      totalFloors: 15,
      floor: 12,
      heating: 'natural gas',
      facade: 'South',
      furnished: true,
      usageStatus: 'empty',
      dues: 1200,
      eligible: true,
      swap: false,
      titleDeedStatus: 'ready'
    },
    images: [
      {
        url: 'https://res.cloudinary.com/dcjsorpmd/image/upload/v1/real-estate/condo1',
        public_id: 'real-estate/condo1'
      }
    ],
    propertyType: 'condo',
    status: 'for-sale',
    yearBuilt: 2019,
    owner: '65676c987d654321fedcba98',
    views: 234,
    favorites: [],
    virtualTour: 'https://example.com/virtual-tour/condo1',
    floorPlan: 'https://example.com/floorplan/condo1',
    amenities: ['gym', 'swimming pool', 'parking', 'elevator', 'security'],
    nearbyPlaces: [
      {
        name: 'Beach',
        type: 'recreation',
        distance: 0.2
      },
      {
        name: 'Marina',
        type: 'recreation',
        distance: 1.0
      }
    ],
    energyRating: 'A'
  }
];

async function seedProperties() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing properties
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Insert new properties
    const properties = await Property.insertMany(sampleProperties);
    console.log(`Seeded ${properties.length} properties`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  }
}

seedProperties();
