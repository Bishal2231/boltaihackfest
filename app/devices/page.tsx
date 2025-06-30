'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Flame, 
  MapPin, 
  Settings, 
  Plus,
  Trash2,
  Edit,
  Power,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { mockDevices } from '@/lib/mock-data';
import { Device } from '@/lib/types';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    deviceId: '',
    address: '',
    lat: '',
    lng: ''
  });

  useEffect(() => {
    // Initialize with mock data
    setDevices(mockDevices);
  }, []);

  const handleToggleSensor = async (deviceId: string, sensorType: 'fire' | 'gas') => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            sensors: { 
              ...device.sensors, 
              [sensorType]: !device.sensors[sensorType] 
            },
            lastUpdate: new Date()
          }
        : device
    ));

    // Simulate MQTT command
    console.log(`MQTT Command: Toggle ${sensorType} sensor for device ${deviceId}`);
  };

  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.deviceId || !newDevice.address) {
      alert('Please fill in all required fields');
      return;
    }

    const device: Device = {
      id: Date.now().toString(),
      deviceId: newDevice.deviceId,
      name: newDevice.name,
      location: {
        lat: parseFloat(newDevice.lat) || 40.7589,
        lng: parseFloat(newDevice.lng) || -73.9851,
        address: newDevice.address
      },
      status: 'active',
      sensors: { fire: true, gas: true },
      lastUpdate: new Date(),
      ownerId: '1'
    };

    setDevices(prev => [...prev, device]);
    setNewDevice({ name: '', deviceId: '', address: '', lat: '', lng: '' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Wifi className="h-4 w-4 text-green-600" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'inactive': return <WifiOff className="h-4 w-4 text-gray-600" />;
      default: return <WifiOff className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                Device Management
              </h1>
              <p className="text-gray-600 mt-1">Monitor and control your fire detection devices</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Device</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Device Name</Label>
                    <Input
                      id="name"
                      value={newDevice.name}
                      onChange={(e) => setNewDevice(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Kitchen Fire Sensor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deviceId">Device ID</Label>
                    <Input
                      id="deviceId"
                      value={newDevice.deviceId}
                      onChange={(e) => setNewDevice(prev => ({ ...prev, deviceId: e.target.value }))}
                      placeholder="e.g., FG-005-NYC"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newDevice.address}
                      onChange={(e) => setNewDevice(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="e.g., 123 Main St, New York, NY"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lat">Latitude</Label>
                      <Input
                        id="lat"
                        value={newDevice.lat}
                        onChange={(e) => setNewDevice(prev => ({ ...prev, lat: e.target.value }))}
                        placeholder="40.7589"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lng">Longitude</Label>
                      <Input
                        id="lng"
                        value={newDevice.lng}
                        onChange={(e) => setNewDevice(prev => ({ ...prev, lng: e.target.value }))}
                        placeholder="-73.9851"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddDevice} className="w-full">
                    Add Device
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Devices</p>
                  <p className="text-2xl font-bold">{devices.length}</p>
                </div>
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {devices.filter(d => d.status === 'active').length}
                  </p>
                </div>
                <Wifi className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {devices.filter(d => d.status === 'alert').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Offline</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {devices.filter(d => d.status === 'inactive').length}
                  </p>
                </div>
                <WifiOff className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <Card key={device.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{device.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(device.status)}
                    <Badge className={getStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{device.deviceId}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{device.location.address}</span>
                </div>
                
                {device.status === 'alert' && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Fire detected! Emergency services notified.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Fire Sensor</span>
                    </div>
                    <Switch
                      checked={device.sensors.fire}
                      onCheckedChange={() => handleToggleSensor(device.id, 'fire')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Gas Sensor</span>
                    </div>
                    <Switch
                      checked={device.sensors.gas}
                      onCheckedChange={() => handleToggleSensor(device.id, 'gas')}
                    />
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Last update: {device.lastUpdate.toLocaleTimeString()}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedDevice(device)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteDevice(device.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {devices.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
              <p className="text-gray-600 mb-4">
                Add your first fire detection device to get started
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}