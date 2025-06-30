import { User, Device, CommunityPost, ChatRoom, ChatMessage, SensorReading } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@fireguard.com',
    username: 'admin',
    fullName: 'Fire Guard Admin',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'john.doe@email.com',
    username: 'johndoe',
    fullName: 'John Doe',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
    isVerified: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    email: 'jane.smith@email.com',
    username: 'janesmith',
    fullName: 'Jane Smith',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    isVerified: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

export const mockDevices: Device[] = [
  {
    id: '1',
    deviceId: 'FG-001-NYC',
    name: 'Central Park Sensor',
    location: {
      lat: 40.7829,
      lng: -73.9654,
      address: 'Central Park, New York, NY'
    },
    status: 'active',
    sensors: { fire: true, gas: true },
    lastUpdate: new Date(),
    ownerId: '1'
  },
  {
    id: '2',
    deviceId: 'FG-002-NYC',
    name: 'Brooklyn Bridge Sensor',
    location: {
      lat: 40.7061,
      lng: -73.9969,
      address: 'Brooklyn Bridge, New York, NY'
    },
    status: 'alert',
    sensors: { fire: true, gas: false },
    lastUpdate: new Date(Date.now() - 5 * 60 * 1000),
    ownerId: '1'
  },
  {
    id: '3',
    deviceId: 'FG-003-NYC',
    name: 'Times Square Sensor',
    location: {
      lat: 40.7580,
      lng: -73.9855,
      address: 'Times Square, New York, NY'
    },
    status: 'active',
    sensors: { fire: true, gas: true },
    lastUpdate: new Date(Date.now() - 2 * 60 * 1000),
    ownerId: '2'
  },
  {
    id: '4',
    deviceId: 'FG-004-LA',
    name: 'Hollywood Hills Sensor',
    location: {
      lat: 34.1341,
      lng: -118.3215,
      address: 'Hollywood Hills, Los Angeles, CA'
    },
    status: 'inactive',
    sensors: { fire: false, gas: true },
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
    ownerId: '3'
  }
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    type: 'emergency',
    title: 'Fire Emergency in Downtown Area',
    content: 'Urgent: Large fire detected in downtown business district. Fire department en route. Please avoid the area between 5th and 7th streets.',
    author: mockUsers[0],
    images: ['https://images.pexels.com/photos/266487/pexels-photo-266487.jpeg?auto=compress&cs=tinysrgb&w=800'],
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: 'Downtown Business District'
    },
    priority: 'critical',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    likes: 25,
    comments: []
  },
  {
    id: '2',
    type: 'news',
    title: 'New Fire Safety Regulations Announced',
    content: 'The city has announced new fire safety regulations for commercial buildings. All businesses must install updated fire detection systems by December 2024.',
    author: mockUsers[0],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    comments: []
  },
  {
    id: '3',
    type: 'community',
    title: 'Fire Safety Workshop This Weekend',
    content: 'Join us for a community fire safety workshop this Saturday at 2 PM. Learn about fire prevention, evacuation procedures, and how to use fire extinguishers.',
    author: mockUsers[1],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 8,
    comments: []
  }
];

export const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Fire Safety Discussion',
    type: 'server',
    participants: mockUsers,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Emergency Response Team',
    type: 'group',
    participants: [mockUsers[0], mockUsers[1]],
    createdAt: new Date('2024-01-10')
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Welcome to the Fire Safety Discussion room!',
    sender: mockUsers[0],
    roomId: '1',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: 'text'
  },
  {
    id: '2',
    content: 'Thanks for setting this up. Great initiative!',
    sender: mockUsers[1],
    roomId: '1',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: 'text'
  },
  {
    id: '3',
    content: 'Fire detection system is working perfectly in my area.',
    sender: mockUsers[2],
    roomId: '1',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'text'
  }
];

export const mockSensorReadings: SensorReading[] = [
  {
    id: '1',
    deviceId: 'FG-002-NYC',
    type: 'fire',
    value: true,
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: '2',
    deviceId: 'FG-002-NYC',
    type: 'gas',
    value: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  }
];