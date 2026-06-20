import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorizeAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('isAdmin');
    if (!user || !user.isAdmin) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
