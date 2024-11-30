import express, { Request, Response } from 'express';
import { SortOrder, Types } from 'mongoose';
import Property from '../models/Property';
import { auth } from '../middleware/auth';
import { uploadImage, deleteImage } from '../utils/cloudinary';
import { AuthRequest } from '../types';

const router = express.Router();

// Get properties by owner
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.params.userId);
    const properties = await Property.find({ owner: userId })
      .populate('owner', 'name email')
      .lean();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching user properties:', error);
    res.status(500).json({ message: 'Error fetching user properties' });
  }
});

// Get all properties with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      minPrice,
      maxPrice,
      propertyType,
      status,
      city,
      bedrooms,
      bathrooms,
      amenities,
      sort = 'createdAt:desc',
      page = '1',
      limit = '10'
    } = req.query;

    const query: any = {};

    // Apply filters
    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (propertyType) query.propertyType = propertyType;
    if (status) query.status = status;
    if (city) query['location.city'] = new RegExp(String(city), 'i');
    if (bedrooms) query['features.bedrooms'] = Number(bedrooms);
    if (bathrooms) query['features.bathrooms'] = Number(bathrooms);
    if (amenities) {
      const amenitiesList = String(amenities).split(',');
      query.amenities = { $all: amenitiesList };
    }

    // Sorting
    const [sortField, sortOrder] = String(sort).split(':');
    const sortOptions: { [key: string]: SortOrder } = {
      [sortField]: sortOrder === 'desc' ? -1 : 1
    };

    // Pagination
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(50, Number(limit)); // Max 50 items per page
    const skip = (pageNumber - 1) * limitNumber;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber)
        .populate('owner', 'name email')
        .lean(),
      Property.countDocuments(query)
    ]);

    res.json({
      properties,
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber)
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

// Get property by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const propertyId = new Types.ObjectId(req.params.id);
    const property = await Property.findById(propertyId)
      .populate('owner', 'name email')
      .populate('favorites', 'name email');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.incrementViews();
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property' });
  }
});

// Create new property
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const propertyData = {
      ...req.body,
      owner: req.user._id
    };

    // Handle image uploads
    if (req.body.images && Array.isArray(req.body.images)) {
      const uploadPromises = req.body.images.map((image: string) => uploadImage(image));
      const uploadedImages = await Promise.all(uploadPromises);
      propertyData.images = uploadedImages;
    }

    const property = new Property(propertyData);
    await property.save();
    
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({ message: 'Error creating property' });
  }
});

// Update property
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const propertyId = new Types.ObjectId(req.params.id);
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    // Handle image updates
    if (req.body.images && Array.isArray(req.body.images)) {
      // Delete old images
      const deletePromises = property.images.map(image => deleteImage(image.public_id));
      await Promise.all(deletePromises);

      // Upload new images
      const uploadPromises = req.body.images.map((image: string) => uploadImage(image));
      const uploadedImages = await Promise.all(uploadPromises);
      req.body.images = uploadedImages;
    }

    // Update only allowed fields
    const allowedUpdates = [
      'title', 'description', 'price', 'location', 'features',
      'propertyType', 'status', 'images', 'amenities', 'virtualTour',
      'floorPlan', 'energyRating', 'availability'
    ];

    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    Object.assign(property, updates);
    property.lastUpdated = new Date();
    await property.save();
    
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(400).json({ message: 'Error updating property' });
  }
});

// Delete property
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const propertyId = new Types.ObjectId(req.params.id);
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    // Delete images from cloudinary
    if (property.images && Array.isArray(property.images)) {
      const deletePromises = property.images.map(image => deleteImage(image.public_id));
      await Promise.all(deletePromises);
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property' });
  }
});

// Toggle favorite status
router.post('/:id/favorite', auth, async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = new Types.ObjectId(req.params.id);
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const userId = new Types.ObjectId(req.user!._id);
    await property.toggleFavorite(userId);
    
    res.json({ message: 'Favorite status updated' });
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    res.status(500).json({ message: 'Error toggling favorite status' });
  }
});

// Get similar properties
router.get('/:id/similar', async (req: Request, res: Response) => {
  try {
    const propertyId = new Types.ObjectId(req.params.id);
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      propertyType: property.propertyType,
      'location.city': property.location.city,
      price: {
        $gte: property.price * 0.8,
        $lte: property.price * 1.2
      }
    })
    .limit(4)
    .populate('owner', 'name email')
    .lean();

    res.json(similarProperties);
  } catch (error) {
    console.error('Error fetching similar properties:', error);
    res.status(500).json({ message: 'Error fetching similar properties' });
  }
});

export default router;
