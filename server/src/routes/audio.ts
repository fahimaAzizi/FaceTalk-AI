import express from 'express';
import { generateSpeech, getVoices, previewVoice } from '../controllers/audioController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/generate', authenticate, generateSpeech);
router.get('/voices', authenticate, getVoices);
router.post('/preview', authenticate, previewVoice);

export default router;
