'use client';

import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private static instance: SocketManager;

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(serverUrl: string = 'http://localhost:7180') {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', () => {
      console.log('Connection error');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Fire sensor events
  onFireData(callback: (data: any) => void) {
    this.socket?.on('fire_data', callback);
  }

  // Gas sensor events
  onGasData(callback: (data: any) => void) {
    this.socket?.on('gas_data', callback);
  }

  // Chat events
  sendMessage(roomId: string, message: string) {
    this.socket?.emit('send_message', { roomId, message });
  }

  onNewMessage(callback: (data: any) => void) {
    this.socket?.on('new_message', callback);
  }

  // Community events
  onNewPost(callback: (data: any) => void) {
    this.socket?.on('new_post', callback);
  }

  // Device control events
  toggleSensor(deviceId: string, sensorType: 'fire' | 'gas', enabled: boolean) {
    this.socket?.emit('toggle_sensor', { deviceId, sensorType, enabled });
  }
}

export default SocketManager;