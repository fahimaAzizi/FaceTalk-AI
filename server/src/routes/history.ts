import express from 'express';
import { getVideoHistory, deleteVideo, downloadVideo } from '../controllers/historyController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getVideoHistory);
router.delete('/:id', authenticate, deleteVideo);
router.get('/:id/download', authenticate, downloadVideo);

export default router;
