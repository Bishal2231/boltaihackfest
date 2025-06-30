'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Clock,
  AlertTriangle,
  Newspaper,
  Users,
  Flame
} from 'lucide-react';
import { mockCommunityPosts } from '@/lib/mock-data';
import { CommunityPost } from '@/lib/types';

interface CommunityFeedProps {
  posts?: CommunityPost[];
}

export default function CommunityFeed({ posts: propPosts }: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(propPosts || mockCommunityPosts);
  const [filter, setFilter] = useState<'all' | 'community' | 'emergency' | 'news'>('all');

  useEffect(() => {
    if (propPosts) {
      setPosts(propPosts);
    }
  }, [propPosts]);

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.type === filter);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'news':
        return <Newspaper className="h-4 w-4 text-blue-500" />;
      case 'community':
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPostBadge = (type: string, priority?: string) => {
    if (type === 'emergency') {
      const priorityColors = {
        critical: 'bg-red-600 text-white',
        high: 'bg-red-500 text-white',
        medium: 'bg-orange-500 text-white',
        low: 'bg-yellow-500 text-white'
      };
      return priorityColors[priority as keyof typeof priorityColors] || 'bg-red-500 text-white';
    }
    
    const typeColors = {
      news: 'bg-blue-100 text-blue-800',
      community: 'bg-green-100 text-green-800'
    };
    return typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800';
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Posts', icon: Users },
              { key: 'community', label: 'Community', icon: Users },
              { key: 'emergency', label: 'Emergency', icon: AlertTriangle },
              { key: 'news', label: 'News', icon: Newspaper }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key as any)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatar} alt={post.author.fullName} />
                    <AvatarFallback>{post.author.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{post.author.fullName}</h3>
                      <span className="text-sm text-gray-500">@{post.author.username}</span>
                      {post.author.role === 'admin' && (
                        <Badge variant="secondary" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(post.createdAt)}
                      {post.location && (
                        <>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-32">{post.location.address}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getPostIcon(post.type)}
                  <Badge className={getPostBadge(post.type, post.priority)}>
                    {post.type === 'emergency' && post.priority ? post.priority : post.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-700 leading-relaxed">{post.content}</p>
                </div>
                
                {post.images && post.images.length > 0 && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt="Post image"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                
                {post.type === 'emergency' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <Flame className="h-4 w-4" />
                      <span className="font-medium text-sm">Emergency Alert</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      This is an emergency post. Fire department has been notified.
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments.length}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  
                  {post.type === 'emergency' && (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Be the first to share something with the community!'
                : `No ${filter} posts available right now.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}