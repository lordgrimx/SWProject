import { v2 as cloudinary } from 'cloudinary';
import { PropertyImage } from '../types';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
export const uploadImage = async (imageString: string): Promise<PropertyImage> => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(imageString, {
      folder: 'real-estate',
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [
        { width: 1200, height: 800, crop: 'fill' },
        { quality: 'auto:good' }
      ]
    });

    return {
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
};
