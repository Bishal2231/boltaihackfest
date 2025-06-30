  import { NextRequest, NextResponse } from 'next/server';
  import { getDatabase } from '@/lib/mongodb';
  import { hashPassword, generateVerificationCode } from '@/lib/auth';
  import { UserDocument } from '@/lib/models/User';
  import { sendVerificationEmail } from '@/lib/notify'; // <== ADD THIS

  export async function POST(request: NextRequest) {
    try {
      const { fullName, username, email, password } = await request.json();

      if (!fullName || !username || !email || !password) {
        return NextResponse.json(
          { error: 'All fields are required' },
          { status: 400 }
        );
      }

      const db = await getDatabase();
      const usersCollection = db.collection<UserDocument>('users');

      // Check if user already exists
      const existingUser = await usersCollection.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email or username already exists' },
          { status: 400 }
        );
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const verificationCode = generateVerificationCode();

      const newUser: UserDocument = {
        email,
        username,
        fullName,
        password: hashedPassword,
        role: 'user',
        isVerified: false,
        verificationCode,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await usersCollection.insertOne(newUser);
      await sendVerificationEmail(email, verificationCode); // <== ADD THIS

      return NextResponse.json({
        message: 'User created successfully',
        userId: result.insertedId,
        verificationCode // In production, send this via email
      });

    } catch (error) {
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }