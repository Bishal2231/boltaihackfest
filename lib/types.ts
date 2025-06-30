export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'user' | 'admin';
  avatar?: string;
  isVerified: boolean;
  verificationCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Device {
  id: string;
  deviceId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'active' | 'inactive' | 'alert';
  sensors: {
    fire: boolean;
    gas: boolean;
  };
  lastUpdate: Date;
  ownerId: string;
}

export interface SensorReading {
  id: string;
  deviceId: string;
  type: 'fire' | 'gas';
  value: boolean;
  timestamp: Date;
}

export interface CommunityPost {
  id: string;
  type: 'community' | 'emergency' | 'news';
  title: string;
  content: string;
  author: User;
  images?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  priority?: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'private' | 'group' | 'server';
  participants: User[];
  lastMessage?: ChatMessage;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: User;
  roomId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

export interface Friendship {
  id: string;
  followerId: string;
  followingId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
}