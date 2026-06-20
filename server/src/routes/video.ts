import express from 'express';
import { generateVideo, getVideoStatus } from '../controllers/videoController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/generate', authenticate, generateVideo);
router.get('/status/:id', authenticate, getVideoStatus);

export default router;
