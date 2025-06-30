'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Hash,
  Plus,
  Search,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';
import { mockUsers, mockChatRooms, mockChatMessages } from '@/lib/mock-data';
import { ChatRoom, ChatMessage, User } from '@/lib/types';

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(mockChatRooms[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<User[]>(mockUsers);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: mockUsers[1], // Current user
      roomId: selectedRoom.id,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const roomMessages = messages.filter(msg => msg.roomId === selectedRoom?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          
          {/* Sidebar - Rooms and Users */}
          <div className="lg:col-span-1 space-y-4">
            {/* Chat Rooms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Chat Rooms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockChatRooms.map((room) => (
                    <Button
                      key={room.id}
                      variant={selectedRoom?.id === room.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedRoom(room)}
                    >
                      {room.type === 'server' ? <Hash className="h-4 w-4 mr-2" /> : <Users className="h-4 w-4 mr-2" />}
                      {room.name}
                    </Button>
                  ))}
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Room
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Online Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Online Users
                  <Badge variant="secondary">{onlineUsers.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {onlineUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.fullName} />
                            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.fullName}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg">
                      {selectedRoom?.type === 'server' ? 
                        <Hash className="h-5 w-5 text-white" /> : 
                        <Users className="h-5 w-5 text-white" />
                      }
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{selectedRoom?.name}</h2>
                      <p className="text-sm text-gray-600">
                        {selectedRoom?.participants.length} members
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-96 p-4">
                  <div className="space-y-4">
                    {roomMessages.map((message) => (
                      <div key={message.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender.avatar} alt={message.sender.fullName} />
                          <AvatarFallback>{message.sender.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{message.sender.fullName}</span>
                            <span className="text-xs text-gray-500">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${selectedRoom?.name}...`}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}