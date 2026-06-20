import express from 'express';
import { getAllUsers, deleteUser, getAllVideos, getAnalytics } from '../controllers/adminController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

router.use(authenticate, authorizeAdmin);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/videos', getAllVideos);
router.get('/analytics', getAnalytics);

export default router;
