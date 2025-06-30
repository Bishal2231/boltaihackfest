'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Flame, MapPin, Activity, AlertTriangle } from 'lucide-react';
import { mockDevices, mockSensorReadings } from '@/lib/mock-data';
import { Device } from '@/lib/types';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different device states
const createCustomIcon = (status: string) => {
  const color = status === 'alert' ? '#ef4444' : status === 'active' ? '#22c55e' : '#6b7280';
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
        <circle cx="12.5" cy="12.5" r="7" fill="white"/>
        <circle cx="12.5" cy="12.5" r="4" fill="${color}"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -35],
  });
};

interface FireMapProps {
  className?: string;
}

export default function FireMap({ className }: FireMapProps) {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setMapLoaded(true);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setDevices(current => 
        current.map(device => ({
          ...device,
          lastUpdate: new Date(),
          // Randomly change status for demo
          status: Math.random() > 0.9 ? 'alert' : Math.random() > 0.1 ? 'active' : 'inactive'
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const activeDevices = devices.filter(d => d.status === 'active').length;
  const alertDevices = devices.filter(d => d.status === 'alert').length;
  const inactiveDevices = devices.filter(d => d.status === 'inactive').length;

  if (!mapLoaded) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Device Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Loading map...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Device Locations & Status
          </CardTitle>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Active ({activeDevices})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Alert ({alertDevices})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-sm">Inactive ({inactiveDevices})</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {alertDevices > 0 && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {alertDevices} device{alertDevices > 1 ? 's' : ''} reporting fire alerts!
              </AlertDescription>
            </Alert>
          )}
          
          <div className="h-96 rounded-lg overflow-hidden border">
            <MapContainer
              center={[40.7589, -73.9851]}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {devices.map((device) => (
                <Marker
                  key={device.id}
                  position={[device.location.lat, device.location.lng]}
                  icon={createCustomIcon(device.status)}
                  eventHandlers={{
                    click: () => setSelectedDevice(device)
                  }}
                >
                  <Popup>
                    <div className="min-w-48">
                      <h3 className="font-semibold text-lg mb-2">{device.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{device.location.address}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status:</span>
                          <Badge 
                            variant={device.status === 'alert' ? 'destructive' : 
                                   device.status === 'active' ? 'default' : 'secondary'}
                          >
                            {device.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Fire Sensor:</span>
                          <Badge variant={device.sensors.fire ? 'default' : 'secondary'}>
                            {device.sensors.fire ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Gas Sensor:</span>
                          <Badge variant={device.sensors.gas ? 'default' : 'secondary'}>
                            {device.sensors.gas ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-2">
                          Last update: {device.lastUpdate.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Alert circles for devices in alert state */}
              {devices
                .filter(device => device.status === 'alert')
                .map(device => (
                  <Circle
                    key={`alert-${device.id}`}
                    center={[device.location.lat, device.location.lng]}
                    radius={500}
                    pathOptions={{ 
                      color: '#ef4444', 
                      fillColor: '#ef4444', 
                      fillOpacity: 0.1 
                    }}
                  />
                ))
              }
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Device Details Sidebar */}
      {selectedDevice && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {selectedDevice.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-1">Device ID</h4>
                <p className="font-mono text-sm">{selectedDevice.deviceId}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-1">Location</h4>
                <p className="text-sm">{selectedDevice.location.address}</p>
                <p className="text-xs text-gray-500">
                  {selectedDevice.location.lat.toFixed(4)}, {selectedDevice.location.lng.toFixed(4)}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">Sensor Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1">
                      <Flame className="h-4 w-4" />
                      Fire Sensor
                    </span>
                    <Badge variant={selectedDevice.sensors.fire ? 'default' : 'secondary'}>
                      {selectedDevice.sensors.fire ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      Gas Sensor
                    </span>
                    <Badge variant={selectedDevice.sensors.gas ? 'default' : 'secondary'}>
                      {selectedDevice.sensors.gas ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}