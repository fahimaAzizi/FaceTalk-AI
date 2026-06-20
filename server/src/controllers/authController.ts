import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import User, { IUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

export const register = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
        subscription: user.subscription,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    const message = error?.message || 'Server error during registration';
    res.status(500).json({ message });
  }
};

export const login = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getProfile = async (req: AuthRequest, res: any): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      credits: user.credits,
      subscription: user.subscription,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
