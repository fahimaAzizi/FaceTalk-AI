import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  imageUrl: string;
  audioUrl: string;
  videoUrl?: string;
  status: 'uploading' | 'processing' | 'generating' | 'completed' | 'failed';
  progress: number;
  error?: string;
  creditsUsed: number;
  duration?: number;
  provider: 'heygen' | 'did' | 'runway';
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  imageUrl: { type: String, required: true },
  audioUrl: { type: String, required: true },
  videoUrl: { type: String },
  status: { type: String, enum: ['uploading', 'processing', 'generating', 'completed', 'failed'], default: 'uploading' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  error: { type: String },
  creditsUsed: { type: Number, required: true },
  duration: { type: Number },
  provider: { type: String, enum: ['heygen', 'did', 'runway'], default: 'did' },
}, { timestamps: true });

VideoSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IVideo>('Video', VideoSchema);
