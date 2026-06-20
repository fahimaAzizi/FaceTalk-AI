import express from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const storage = multer({ storage: multer.memoryStorage() });
const upload = storage.single('image');

router.post('/image', authenticate, upload, uploadImage);
router.delete('/image', authenticate, deleteImage);

export default router;
