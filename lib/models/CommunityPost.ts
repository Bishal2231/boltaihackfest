import { ObjectId } from 'mongodb';

export interface CommunityPostDocument {
  _id?: ObjectId;
  type: 'community' | 'emergency' | 'news';
  title: string;
  content: string;
  authorId: string;
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
  comments: CommentDocument[];
}

export interface CommentDocument {
  _id?: ObjectId;
  content: string;
  authorId: string;
  createdAt: Date;
}

export interface CommunityPostResponse {
  id: string;
  type: 'community' | 'emergency' | 'news';
  title: string;
  content: string;
  authorId: string;
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
  comments: CommentDocument[];
}

export function transformCommunityPost(post: CommunityPostDocument): CommunityPostResponse {
  return {
    id: post._id?.toString() || '',
    type: post.type,
    title: post.title,
    content: post.content,
    authorId: post.authorId,
    images: post.images,
    location: post.location,
    priority: post.priority,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    likes: post.likes,
    comments: post.comments
  };
}