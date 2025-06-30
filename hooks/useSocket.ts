'use client';

import { useEffect, useState } from 'react';
import SocketManager from '@/lib/socket';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState({
    fire: null as any,
    gas: null as any,
  });

  useEffect(() => {
    const socketManager = SocketManager.getInstance();
    const socket = socketManager.connect();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for sensor data
    socketManager.onFireData((data) => {
      setSensorData(prev => ({ ...prev, fire: data }));
    });

    socketManager.onGasData((data) => {
      setSensorData(prev => ({ ...prev, gas: data }));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('fire_data');
      socket.off('gas_data');
    };
  }, []);

  return {
    isConnected,
    sensorData,
    socket: SocketManager.getInstance().getSocket()
  };
}