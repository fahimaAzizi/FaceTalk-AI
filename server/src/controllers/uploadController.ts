import { v2 as cloudinary } from 'cloudinary';
import { AuthRequest, authenticate } from '../middleware/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const buffer = req.file.buffer;
    const base64Image = `data:${req.file.mimetype};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      resource_type: 'image',
      folder: 'facetalk-ai/images',
    });

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};

export const deleteImage = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      res.status(400).json({ message: 'Public ID is required' });
      return;
    }

    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
};
