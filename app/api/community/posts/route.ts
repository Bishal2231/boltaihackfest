import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { CommunityPostDocument, transformCommunityPost } from '@/lib/models/CommunityPost';
import { UserDocument } from '@/lib/models/User';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const postsCollection = db.collection<CommunityPostDocument>('community_posts');
    const usersCollection = db.collection<UserDocument>('users');

    // Get posts with author information
    const posts = await postsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    // Get author information for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await usersCollection.findOne({ _id: new ObjectId(post.authorId) });
        return {
          ...transformCommunityPost(post),
          author: author ? {
            id: author._id?.toString(),
            fullName: author.fullName,
            username: author.username,
            avatar: author.avatar,
            role: author.role,
            isVerified: author.isVerified
          } : null
        };
      })
    );

    return NextResponse.json(postsWithAuthors.filter(post => post.author));

  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { type, title, content, location, priority, images } = await request.json();

    if (!type || !title || !content) {
      return NextResponse.json(
        { error: 'Type, title, and content are required' },
        { status: 400 }
      );
    }

    // Check if user can create news posts
    if (type === 'news') {
      const db = await getDatabase();
      const usersCollection = db.collection<UserDocument>('users');
      const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
      
      if (!user || user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Only administrators can create news posts' },
          { status: 403 }
        );
      }
    }

    const db = await getDatabase();
    const postsCollection = db.collection<CommunityPostDocument>('community_posts');

    const newPost: CommunityPostDocument = {
      type,
      title,
      content,
      authorId: decoded.userId,
      images,
      location,
      priority: type === 'emergency' ? priority : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      comments: []
    };

    const result = await postsCollection.insertOne(newPost);
    const post = await postsCollection.findOne({ _id: result.insertedId });

    return NextResponse.json(transformCommunityPost(post!));

  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}