import express, { Response } from 'express';
import { Types } from 'mongoose';
import User from '../models/User';
import { auth } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Add property to favorites
router.post('/favorites/:propertyId', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const propertyId = new Types.ObjectId(req.params.propertyId);
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favorites.includes(propertyId)) {
      user.favorites.push(propertyId);
      await user.save();
    }

    res.json({ message: 'Property added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Error adding property to favorites' });
  }
});

// Remove property from favorites
router.delete('/favorites/:propertyId', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const propertyId = new Types.ObjectId(req.params.propertyId);
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(id => !id.equals(propertyId));
    await user.save();

    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Error removing property from favorites' });
  }
});

// Get user's favorite properties
router.get('/favorites', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(req.user._id)
      .populate('favorites')
      .select('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorite properties' });
  }
});

export default router;
