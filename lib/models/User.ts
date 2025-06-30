import { ObjectId } from 'mongodb';

export interface UserDocument {
  _id?: ObjectId;
  email: string;
  username: string;
  fullName: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  isVerified: boolean;
  verificationCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'user' | 'admin';
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function transformUser(user: UserDocument): UserResponse {
  return {
    id: user._id?.toString() || '',
    email: user.email,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}