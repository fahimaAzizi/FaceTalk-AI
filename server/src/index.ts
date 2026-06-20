import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import audioRoutes from './routes/audio';
import videoRoutes from './routes/video';
import historyRoutes from './routes/history';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aliveframe-ai');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('Database connection error:', error?.message || error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

export default app;
