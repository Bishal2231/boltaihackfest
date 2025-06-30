'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Flame, 
  MapPin, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';

interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'fire' | 'gas';
  location: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'investigating';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function RecentAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Generate mock alerts
    const mockAlerts: Alert[] = [
      {
        id: '1',
        deviceId: 'FG-002-NYC',
        deviceName: 'Brooklyn Bridge Sensor',
        type: 'fire',
        location: 'Brooklyn Bridge, New York, NY',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'active',
        priority: 'critical'
      },
      {
        id: '2',
        deviceId: 'FG-001-NYC',
        deviceName: 'Central Park Sensor',
        type: 'gas',
        location: 'Central Park, New York, NY',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'investigating',
        priority: 'high'
      },
      {
        id: '3',
        deviceId: 'FG-003-NYC',
        deviceName: 'Times Square Sensor',
        type: 'fire',
        location: 'Times Square, New York, NY',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'resolved',
        priority: 'medium'
      },
      {
        id: '4',
        deviceId: 'FG-004-LA',
        deviceName: 'Hollywood Hills Sensor',
        type: 'gas',
        location: 'Hollywood Hills, Los Angeles, CA',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: 'resolved',
        priority: 'low'
      }
    ];

    setAlerts(mockAlerts);

    // Simulate new alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          deviceId: `FG-${Math.floor(Math.random() * 999)}-NYC`,
          deviceName: `Sensor ${Math.floor(Math.random() * 100)}`,
          type: Math.random() > 0.5 ? 'fire' : 'gas',
          location: 'New York, NY',
          timestamp: new Date(),
          status: 'active',
          priority: Math.random() > 0.5 ? 'critical' : 'high'
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'investigating':
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'destructive',
      investigating: 'default',
      resolved: 'secondary'
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return variants[priority as keyof typeof variants] || 'secondary';
  };

  const formatTimeAgo = (timestamp: Date) => {
    const diff = Date.now() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No recent alerts</p>
                <p className="text-sm">All systems operating normally</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {alert.type === 'fire' ? (
                      <Flame className="h-5 w-5 text-red-500" />
                    ) : (
                      <div className="h-5 w-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {alert.deviceName}
                      </h4>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(alert.status)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {alert.type === 'fire' ? 'Fire detected' : 'Gas leak detected'}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{alert.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadge(alert.status)} className="text-xs">
                          {alert.status}
                        </Badge>
                        <Badge variant={getPriorityBadge(alert.priority)} className="text-xs">
                          {alert.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {alerts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All Alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}