import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { DeviceDocument, transformDevice } from '@/lib/models/Device';

export async function GET(request: NextRequest) {
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

    const db = await getDatabase();
    const devicesCollection = db.collection<DeviceDocument>('devices');

    const devices = await devicesCollection.find({ ownerId: decoded.userId }).toArray();
    const transformedDevices = devices.map(transformDevice);

    return NextResponse.json(transformedDevices);

  } catch (error) {
    console.error('Get devices error:', error);
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

    const { deviceId, name, location } = await request.json();

    if (!deviceId || !name || !location) {
      return NextResponse.json(
        { error: 'Device ID, name, and location are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const devicesCollection = db.collection<DeviceDocument>('devices');

    // Check if device ID already exists
    const existingDevice = await devicesCollection.findOne({ deviceId });
    if (existingDevice) {
      return NextResponse.json(
        { error: 'Device with this ID already exists' },
        { status: 400 }
      );
    }

    const newDevice: DeviceDocument = {
      deviceId,
      name,
      location,
      status: 'active',
      sensors: { fire: true, gas: true },
      lastUpdate: new Date(),
      ownerId: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await devicesCollection.insertOne(newDevice);
    const device = await devicesCollection.findOne({ _id: result.insertedId });

    return NextResponse.json(transformDevice(device!));

  } catch (error) {
    console.error('Create device error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}