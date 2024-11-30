import mongoose, { Document, Schema, Types } from 'mongoose';
import { Property } from '../types';

interface PropertyDocument extends Omit<Property, '_id'>, Document {
  incrementViews(): Promise<PropertyDocument>;
  toggleFavorite(userId: Types.ObjectId | string): Promise<PropertyDocument>;
}

const propertySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  features: {
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    parking: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    airConditioning: { type: Boolean, default: false },
    heating: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    garden: { type: Boolean, default: false },
    pool: { type: Boolean, default: false },
    security: { type: Boolean, default: false }
  },
  specifications: {
    constructionYear: { type: Number },
    totalFloors: { type: Number },
    floor: { type: Number },
    heating: { type: String, enum: ['natural gas', 'electric', 'solar', 'other'] },
    facade: { type: String },
    furnished: { type: Boolean, default: false },
    usageStatus: { type: String, enum: ['empty', 'tenant', 'owner'] },
    dues: { type: Number },
    eligible: { type: Boolean, default: true },
    swap: { type: Boolean, default: false },
    titleDeedStatus: { type: String, enum: ['ready', 'under construction', 'cooperative'] }
  },
  images: [{
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }],
  propertyType: {
    type: String,
    enum: ['house', 'apartment', 'condo', 'villa', 'land'],
    required: true
  },
  status: {
    type: String,
    enum: ['for-sale', 'for-rent', 'sold', 'rented'],
    required: true
  },
  yearBuilt: { type: Number },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: { type: Number, default: 0 },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  virtualTour: { type: String },
  floorPlan: { type: String },
  amenities: [{
    type: String,
    enum: [
      'gym', 'swimming pool', 'parking', 'elevator',
      'security', 'playground', 'laundry', 'pet friendly',
      'storage', 'fitness center', 'tennis court', 'bbq area'
    ]
  }],
  nearbyPlaces: [{
    name: { type: String },
    type: { type: String },
    distance: { type: Number }
  }],
  energyRating: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  },
  availability: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better search performance
propertySchema.index({ 'location.city': 1, 'location.state': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ title: 'text', description: 'text', 'location.address': 'text' });

// Virtual field for formatted price
propertySchema.virtual('formattedPrice').get(function(this: PropertyDocument) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(this.price);
});

// Method to increment view count
propertySchema.methods.incrementViews = async function(this: PropertyDocument) {
  this.views += 1;
  return this.save();
};

// Method to toggle favorite status
propertySchema.methods.toggleFavorite = async function(this: PropertyDocument, userId: Types.ObjectId | string) {
  const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
  const index = this.favorites.findIndex(id => id.equals(userObjectId));
  if (index === -1) {
    this.favorites.push(userObjectId);
  } else {
    this.favorites.splice(index, 1);
  }
  return this.save();
};

export default mongoose.model<PropertyDocument>('Property', propertySchema);
