'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Flame, 
  Users, 
  MessageSquare, 
  Settings,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentAlerts from '@/components/dashboard/RecentAlerts';
import CommunityFeed from '@/components/community/CommunityFeed';

// Dynamic import for FireMap to avoid SSR issues with Leaflet
const FireMap = dynamic(() => import('@/components/dashboard/FireMap'), {
  ssr: false,
  loading: () => (
    <Card>
      <CardHeader>
        <CardTitle>Device Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading map...</p>
        </div>
      </CardContent>
    </Card>
  )
});

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'community' | 'devices'>('overview');
  const [realTimeData, setRealTimeData] = useState({
    connected: false,
    lastUpdate: new Date(),
    activeAlerts: 1
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simulate WebSocket connection for real-time data
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        connected: true,
        lastUpdate: new Date(),
        activeAlerts: Math.floor(Math.random() * 3)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: 'View All Devices',
      description: 'Manage your fire detection devices',
      icon: Activity,
      href: '/devices',
      color: 'blue'
    },
    {
      title: 'Community Posts',
      description: 'Check latest community updates',
      icon: Users,
      href: '/community',
      color: 'green'
    },
    {
      title: 'Emergency Chat',
      description: 'Connect with emergency services',
      icon: MessageSquare,
      href: '/chat',
      color: 'orange'
    },
    {
      title: 'Settings',
      description: 'Configure your preferences',
      icon: Settings,
      href: '/settings',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                FireGuard Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Real-time fire detection and community safety platform</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                realTimeData.connected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  realTimeData.connected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                {realTimeData.connected ? 'Connected' : 'Connecting...'}
              </div>
              
              {realTimeData.activeAlerts > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {realTimeData.activeAlerts} Active Alert{realTimeData.activeAlerts > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Alerts Banner */}
        {realTimeData.activeAlerts > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Fire Alert Active:</strong> {realTimeData.activeAlerts} device{realTimeData.activeAlerts > 1 ? 's' : ''} reporting fire detection. 
              <Button variant="link" className="text-red-800 underline p-0 ml-2 h-auto">
                View Details →
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: 'Overview', icon: TrendingUp },
                { key: 'map', label: 'Live Map', icon: Activity },
                { key: 'community', label: 'Community', icon: Users },
                { key: 'devices', label: 'Devices', icon: Settings }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <StatsOverview />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FireMap />
              </div>
              <div>
                <RecentAlerts />
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center text-center hover:bg-gray-50"
                        asChild
                      >
                        <a href={action.href}>
                          <IconComponent className="h-8 w-8 mb-2 text-gray-600" />
                          <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                          <p className="text-xs text-gray-500">{action.description}</p>
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <FireMap className="w-full" />
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-6">
            <CommunityFeed />
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Device Management</h3>
                <p className="text-gray-600 mb-4">
                  Configure and monitor your fire detection devices
                </p>
                <Button>Add New Device</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer Info */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last updated: {isMounted ? realTimeData.lastUpdate.toLocaleTimeString() : ''}
              </div>
              <div className="text-right">
                <p>FireGuard Community Safety Platform</p>
                <p className="text-xs text-gray-500">Powered by Next.js & MongoDB Atlas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}