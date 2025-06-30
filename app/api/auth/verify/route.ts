import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { generateToken } from '@/lib/auth';
import { UserDocument, transformUser } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, verificationCode } = await request.json();

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<UserDocument>('users');

    // Find user and verify code
    const user = await usersCollection.findOne({ 
      email, 
      verificationCode 
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Update user as verified
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          isVerified: true, 
          updatedAt: new Date() 
        },
        $unset: { verificationCode: "" }
      }
    );

    // Generate JWT token
    const token = generateToken(user._id!.toString());

    // Return user data
    const userResponse = transformUser({ ...user, isVerified: true });

    return NextResponse.json({
      message: 'Email verified successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}