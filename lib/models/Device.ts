import { ObjectId } from 'mongodb';

export interface DeviceDocument {
  _id?: ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceResponse {
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

export function transformDevice(device: DeviceDocument): DeviceResponse {
  return {
    id: device._id?.toString() || '',
    deviceId: device.deviceId,
    name: device.name,
    location: device.location,
    status: device.status,
    sensors: device.sensors,
    lastUpdate: device.lastUpdate,
    ownerId: device.ownerId
  };
}