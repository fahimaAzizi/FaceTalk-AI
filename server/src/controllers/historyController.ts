import { AuthRequest, authenticate } from '../middleware/auth';
import Video from '../models/Video';

export const getVideoHistory = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-userId');

    const total = await Video.countDocuments({ userId: req.userId });

    res.json({
      videos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalVideos: total,
      },
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteVideo = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await Video.findOne({ _id: id, userId: req.userId });
    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }
    await Video.findByIdAndDelete(id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const downloadVideo = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await Video.findOne({ _id: id, userId: req.userId });
    if (!video || !video.videoUrl) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }
    res.json({ downloadUrl: video.videoUrl, title: video.title });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
