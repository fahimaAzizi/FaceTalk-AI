import { AuthRequest, authenticate, authorizeAdmin } from '../middleware/auth';
import User from '../models/User';
import Video from '../models/Video';

export const getAllUsers = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find().select('-password').skip(skip).limit(limit);
    const total = await User.countDocuments();

    res.json({ users, pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalUsers: total } });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (user.isAdmin) {
      res.status(403).json({ message: 'Cannot delete admin user' });
      return;
    }
    await User.findByIdAndDelete(id);
    await Video.deleteMany({ userId: id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllVideos = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const videos = await Video.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('userId', 'name email');
    const total = await Video.countDocuments();

    res.json({ videos, pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalVideos: total } });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAnalytics = async (_req: AuthRequest, res: any): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVideos = await Video.countDocuments();
    const completedVideos = await Video.countDocuments({ status: 'completed' });
    const failedVideos = await Video.countDocuments({ status: 'failed' });
    const totalCreditsUsed = await Video.aggregate([{ $group: { _id: null, total: { $sum: '$creditsUsed' } } }]);
    const subscriptionBreakdown = await User.aggregate([
      { $group: { _id: '$subscription', count: { $sum: 1 } } },
    ]);

    res.json({
      totalUsers,
      totalVideos,
      completedVideos,
      failedVideos,
      totalCreditsUsed: totalCreditsUsed[0]?.total || 0,
      subscriptionBreakdown,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
