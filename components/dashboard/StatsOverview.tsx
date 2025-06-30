'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Flame, 
  Shield, 
  Users, 
  AlertTriangle,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';
import { mockDevices, mockUsers, mockCommunityPosts } from '@/lib/mock-data';

export default function StatsOverview() {
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    alertDevices: 0,
    totalUsers: 0,
    emergencyPosts: 0,
    responseTime: '2.3 min'
  });

  useEffect(() => {
    // Calculate stats from mock data
    const totalDevices = mockDevices.length;
    const activeDevices = mockDevices.filter(d => d.status === 'active').length;
    const alertDevices = mockDevices.filter(d => d.status === 'alert').length;
    const totalUsers = mockUsers.length;
    const emergencyPosts = mockCommunityPosts.filter(p => p.type === 'emergency').length;

    setStats({
      totalDevices,
      activeDevices,
      alertDevices,
      totalUsers,
      emergencyPosts,
      responseTime: '2.3 min'
    });

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeDevices: Math.max(0, prev.totalDevices - Math.floor(Math.random() * 2)),
        alertDevices: Math.floor(Math.random() * 3),
        responseTime: `${(2 + Math.random()).toFixed(1)} min`
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Total Devices',
      value: stats.totalDevices,
      icon: MapPin,
      color: 'blue',
      description: 'Deployed sensors'
    },
    {
      title: 'Active Devices',
      value: stats.activeDevices,
      icon: Activity,
      color: 'green',
      description: 'Currently online'
    },
    {
      title: 'Fire Alerts',
      value: stats.alertDevices,
      icon: Flame,
      color: 'red',
      description: 'Active alerts',
      alert: stats.alertDevices > 0
    },
    {
      title: 'Community Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'purple',
      description: 'Registered users'
    },
    {
      title: 'Emergency Posts',
      value: stats.emergencyPosts,
      icon: AlertTriangle,
      color: 'orange',
      description: 'Last 24 hours'
    },
    {
      title: 'Avg Response Time',
      value: stats.responseTime,
      icon: Clock,
      color: 'indigo',
      description: 'Fire department'
    }
  ];

  const getColorClasses = (color: string, alert?: boolean) => {
    if (alert) {
      return {
        bg: 'bg-red-50',
        icon: 'bg-red-100 text-red-600',
        border: 'border-red-200'
      };
    }

    const colors = {
      blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', border: 'border-green-200' },
      red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', border: 'border-red-200' },
      purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
      indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-200' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        const colorClasses = getColorClasses(stat.color, stat.alert);
        
        return (
          <Card 
            key={index} 
            className={`transition-all duration-200 hover:shadow-md ${colorClasses.bg} ${colorClasses.border} border`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${colorClasses.icon}`}>
                <IconComponent className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                    {stat.alert && (
                      <Badge className="ml-2 bg-red-100 text-red-800 text-xs">
                        ALERT
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {stat.description}
                  </p>
                </div>
                {stat.alert && (
                  <div className="flex items-center text-red-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">High</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}