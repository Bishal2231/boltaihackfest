'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Smartphone,
  Mail,
  MessageSquare
} from 'lucide-react';

interface SettingsState {
  notifications: {
    emailAlerts: boolean;
    pushNotifications: boolean;
    emergencyAlerts: boolean;
    communityUpdates: boolean;
    chatMessages: boolean;
  };
  privacy: {
    profileVisibility: string;
    showLocation: boolean;
    showOnlineStatus: boolean;
  };
  preferences: {
    language: string;
    theme: string;
    autoRefresh: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      emergencyAlerts: true,
      communityUpdates: false,
      chatMessages: true
    },
    privacy: {
      profileVisibility: 'public',
      showLocation: true,
      showOnlineStatus: true
    },
    preferences: {
      language: 'en',
      theme: 'light',
      autoRefresh: true
    }
  });

  const handleToggle = <
    Category extends keyof SettingsState,
    Setting extends keyof SettingsState[Category]
  >(
    category: Category,
    setting: Setting
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelectChange = <
    Category extends keyof SettingsState,
    Setting extends keyof SettingsState[Category]
  >(
    category: Category,
    setting: Setting,
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and notifications</p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <p className="text-sm text-gray-600">Receive fire alerts via email</p>
                </div>
                <Switch
                  id="email-alerts"
                  checked={settings.notifications.emailAlerts}
                  onCheckedChange={() => handleToggle('notifications', 'emailAlerts')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-600">Browser push notifications</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={() => handleToggle('notifications', 'pushNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                  <p className="text-sm text-gray-600">Critical fire emergency notifications</p>
                </div>
                <Switch
                  id="emergency-alerts"
                  checked={settings.notifications.emergencyAlerts}
                  onCheckedChange={() => handleToggle('notifications', 'emergencyAlerts')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="community-updates">Community Updates</Label>
                  <p className="text-sm text-gray-600">New posts and community activity</p>
                </div>
                <Switch
                  id="community-updates"
                  checked={settings.notifications.communityUpdates}
                  onCheckedChange={() => handleToggle('notifications', 'communityUpdates')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="chat-messages">Chat Messages</Label>
                  <p className="text-sm text-gray-600">New chat messages and mentions</p>
                </div>
                <Switch
                  id="chat-messages"
                  checked={settings.notifications.chatMessages}
                  onCheckedChange={() => handleToggle('notifications', 'chatMessages')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <p className="text-sm text-gray-600">Who can see your profile</p>
                </div>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) => handleSelectChange('privacy', 'profileVisibility', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-location">Show Location</Label>
                  <p className="text-sm text-gray-600">Display your location in posts</p>
                </div>
                <Switch
                  id="show-location"
                  checked={settings.privacy.showLocation}
                  onCheckedChange={() => handleToggle('privacy', 'showLocation')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="online-status">Online Status</Label>
                  <p className="text-sm text-gray-600">Show when you're online</p>
                </div>
                <Switch
                  id="online-status"
                  checked={settings.privacy.showOnlineStatus}
                  onCheckedChange={() => handleToggle('privacy', 'showOnlineStatus')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <p className="text-sm text-gray-600">Choose your preferred language</p>
                </div>
                <Select
                  value={settings.preferences.language}
                  onValueChange={(value) => handleSelectChange('preferences', 'language', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="ne">Nepali</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-gray-600">Choose your display theme</p>
                </div>
                <Select
                  value={settings.preferences.theme}
                  onValueChange={(value) => handleSelectChange('preferences', 'theme', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-refresh">Auto Refresh</Label>
                  <p className="text-sm text-gray-600">Automatically refresh sensor data</p>
                </div>
                <Switch
                  id="auto-refresh"
                  checked={settings.preferences.autoRefresh}
                  onCheckedChange={() => handleToggle('preferences', 'autoRefresh')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Device Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Device Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Connected Devices</h3>
                <p className="text-sm text-gray-600 mb-3">Manage your fire detection devices</p>
                <Button variant="outline" size="sm">
                  Manage Devices
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">MQTT Settings</h3>
                <p className="text-sm text-gray-600 mb-3">Configure device communication</p>
                <div className="space-y-2">
                  <Input placeholder="MQTT Broker URL" />
                  <Input placeholder="Username" />
                  <Input type="password" placeholder="Password" />
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Save MQTT Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="px-8">
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
