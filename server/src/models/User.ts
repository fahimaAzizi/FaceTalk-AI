import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isVerified: boolean;
  credits: number;
  subscription: 'free' | 'premium' | 'enterprise';
  isAdmin: boolean;
  comparePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  credits: { type: Number, default: 10 },
  subscription: { type: String, enum: ['free', 'premium', 'enterprise'], default: 'free' },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
