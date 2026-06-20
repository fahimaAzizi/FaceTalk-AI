import { AuthRequest, authenticate } from '../middleware/auth';
import User from '../models/User';
import Video from '../models/Video';
import axios from 'axios';

const CREDITS_PER_VIDEO = 1;

export const generateVideo = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const { imageUrl, audioUrl, text, provider = 'did', voice } = req.body;
    if (!imageUrl || !audioUrl) {
      res.status(400).json({ message: 'Image URL and audio URL are required' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user || user.credits < CREDITS_PER_VIDEO) {
      res.status(403).json({ message: 'Insufficient credits. Please upgrade your plan.' });
      return;
    }

    const video = new Video({
      userId: req.userId,
      title: text?.slice(0, 50) || 'Untitled Video',
      imageUrl,
      audioUrl,
      status: 'generating',
      progress: 10,
      creditsUsed: CREDITS_PER_VIDEO,
      provider: provider as 'heygen' | 'did' | 'runway',
    });

    await video.save();
    user.credits -= CREDITS_PER_VIDEO;
    await user.save();

    res.status(201).json({
      message: 'Video generation started',
      videoId: video._id,
      status: video.status,
    });

    processVideoGeneration(video._id.toString(), imageUrl, audioUrl, provider).catch(console.error);
  } catch (error) {
    console.error('Generate video error:', error);
    res.status(500).json({ message: 'Failed to start video generation' });
  }
};

const processVideoGeneration = async (
  videoId: string,
  imageUrl: string,
  audioUrl: string,
  provider: string
): Promise<void> => {
  try {
    await Video.findByIdAndUpdate(videoId, { status: 'processing', progress: 30 });

    let videoUrl: string;
    if (provider === 'heygen') {
      videoUrl = await generateWithHeyGen(imageUrl, audioUrl);
    } else if (provider === 'runway') {
      videoUrl = await generateWithRunway(imageUrl, audioUrl);
    } else {
      videoUrl = await generateWithDID(imageUrl, audioUrl);
    }

    await Video.findByIdAndUpdate(videoId, {
      videoUrl,
      status: 'completed',
      progress: 100,
    });
  } catch (error: any) {
    console.error(`Video generation error for ${videoId}:`, error);
    await Video.findByIdAndUpdate(videoId, {
      status: 'failed',
      error: error.message || 'Video generation failed',
    });
  }
};

const generateWithDID = async (imageUrl: string, audioUrl: string): Promise<string> => {
  const apiKey = process.env.DID_API_KEY;
  if (!apiKey) {
    throw new Error('D-ID API key not configured');
  }

  try {
    const response = await axios.post(
      'https://api.d-id.com/talks',
      { source_url: imageUrl, audio_url: audioUrl },
      { headers: { Authorization: `Basic ${apiKey}`, 'Content-Type': 'application/json' } }
    );

    const { id } = response.data;
    let result = response.data;

    for (let i = 0; i < 80; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const statusRes = await axios.get(`https://api.d-id.com/talks/${id}`, {
        headers: { Authorization: `Basic ${apiKey}` },
      });
      result = statusRes.data;
      if (result.status === 'done') return result.result_url;
      if (result.status === 'error') throw new Error(result.description || 'D-ID processing failed');
    }
    throw new Error('D-ID processing timeout');
  } catch (error: any) {
    if (error.response?.status === 402) {
      throw new Error('D-ID credits exhausted. Please try another provider.');
    }
    throw error;
  }
};

const generateWithHeyGen = async (imageUrl: string, audioUrl: string): Promise<string> => {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    throw new Error('HeyGen API key not configured');
  }

  try {
    const response = await axios.post(
      'https://api.heygen.com/v1/video/talking_photo',
      { image_url: imageUrl, audio_url: audioUrl },
      { headers: { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' } }
    );

    const { data } = response.data;
    let result = data;

    for (let i = 0; i < 80; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const statusRes = await axios.get(`https://api.heygen.com/v1/video/talking_photo/${data.id}`, {
        headers: { 'X-Api-Key': apiKey },
      });
      result = statusRes.data.data;
      if (result.status === 'completed') return result.video_url;
      if (result.status === 'failed') throw new Error(result.message || 'HeyGen processing failed');
    }
    throw new Error('HeyGen processing timeout');
  } catch (error: any) {
    if (error.response?.status === 402) {
      throw new Error('HeyGen credits exhausted. Please try another provider.');
    }
    throw error;
  }
};

const generateWithRunway = async (_imageUrl: string, _audioUrl: string): Promise<string> => {
  throw new Error('Runway API integration not yet implemented');
};

export const getVideoStatus = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }
    if (video.userId.toString() !== req.userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    res.json({
      id: video._id,
      status: video.status,
      progress: video.progress,
      videoUrl: video.videoUrl,
      error: video.error,
      createdAt: video.createdAt,
    });
  } catch (error) {
    console.error('Get video status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
