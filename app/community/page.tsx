'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Users, 
  AlertTriangle, 
  Newspaper,
  MapPin,
  Upload,
  X
} from 'lucide-react';
import CommunityFeed from '@/components/community/CommunityFeed';
import { mockCommunityPosts, mockUsers } from '@/lib/mock-data';
import { CommunityPost } from '@/lib/types';

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPost, setNewPost] = useState({
    type: 'community' as 'community' | 'emergency' | 'news',
    title: '',
    content: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    images: [] as string[]
  });

  // Check if user is admin
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const isAdmin = userRole === 'admin';

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      alert('Please fill in title and content');
      return;
    }

    // Check if user can create news posts
    if (newPost.type === 'news' && !isAdmin) {
      alert('Only administrators can create news posts');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to create post
      await new Promise(resolve => setTimeout(resolve, 1000));

      const post: CommunityPost = {
        id: Date.now().toString(),
        type: newPost.type,
        title: newPost.title,
        content: newPost.content,
        author: mockUsers[isAdmin ? 0 : 1], // Admin or regular user
        images: newPost.images.length > 0 ? newPost.images : undefined,
        location: newPost.location ? {
          lat: 40.7589,
          lng: -73.9851,
          address: newPost.location
        } : undefined,
        priority: newPost.type === 'emergency' ? newPost.priority : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        comments: []
      };

      setPosts(prev => [post, ...prev]);
      
      // Reset form
      setNewPost({
        type: 'community',
        title: '',
        content: '',
        location: '',
        priority: 'medium',
        images: []
      });
      
      setIsCreateDialogOpen(false);
      
      // Show success message
      alert(`${newPost.type.charAt(0).toUpperCase() + newPost.type.slice(1)} post created successfully!`);
      
    } catch (error) {
      alert('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Simulate image upload to Cloudinary
      const imageUrls = Array.from(files).map(file => 
        `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=800`
      );
      setNewPost(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
    }
  };

  const removeImage = (index: number) => {
    setNewPost(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                Community Hub
              </h1>
              <p className="text-gray-600 mt-1">Share updates, news, and emergency alerts with the community</p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type">Post Type</Label>
                    <Select value={newPost.type} onValueChange={(value: any) => setNewPost(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="community">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Community Post
                          </div>
                        </SelectItem>
                        <SelectItem value="emergency">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Emergency Alert
                          </div>
                        </SelectItem>
                        {isAdmin && (
                          <SelectItem value="news">
                            <div className="flex items-center gap-2">
                              <Newspaper className="h-4 w-4" />
                              News Update
                            </div>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {newPost.type === 'emergency' && (
                    <div>
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select value={newPost.priority} onValueChange={(value: any) => setNewPost(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="critical">Critical Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter post title..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your post content..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input
                      id="location"
                      value={newPost.location}
                      onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter location..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="images">Images (Optional)</Label>
                    <div className="space-y-2">
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                      {newPost.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {newPost.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {newPost.type === 'emergency' && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        Emergency posts will automatically notify fire departments and nearby users.
                      </AlertDescription>
                    </Alert>
                  )}

                  {newPost.type === 'news' && !isAdmin && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        Only administrators can create news posts.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    onClick={handleCreatePost} 
                    className="w-full"
                    disabled={isLoading || (newPost.type === 'news' && !isAdmin)}
                  >
                    {isLoading ? 'Creating...' : 'Create Post'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Community Feed */}
        <CommunityFeed posts={posts} />
      </div>
    </div>
  );
}