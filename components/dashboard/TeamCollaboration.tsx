'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, Send, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  avatar: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Lead Trainer',
    avatar: 'SJ',
    status: 'online'
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Trainer',
    avatar: 'MC',
    status: 'online'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    role: 'Volunteer Coordinator',
    avatar: 'EW',
    status: 'busy'
  },
  {
    id: '4',
    name: 'David Rodriguez',
    role: 'Admin',
    avatar: 'DR',
    status: 'offline'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Sarah Johnson',
    content: 'Great job everyone on the last workshop!',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    avatar: 'SJ'
  },
  {
    id: '2',
    sender: 'Michael Chen',
    content: 'Thanks! The feedback from participants was really positive.',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    avatar: 'MC'
  },
  {
    id: '3',
    sender: 'Emma Wilson',
    content: 'We should plan the next session. How about next Tuesday?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    avatar: 'EW'
  }
];

export const TeamCollaboration: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: newMessage,
        timestamp: new Date(),
        avatar: 'YO'
      };
      setMessages([...messages, message]);
      setNewMessage('');
      toast.success('Message sent!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Team Collaboration</h2>
        </div>
        <p className="text-purple-100">Work together and share updates with your team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 text-gray-900">Team Members</h3>
          <div className="space-y-3">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        member.status === 'online'
                          ? 'bg-green-500'
                          : member.status === 'busy'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </div>
            ))}
          </div>

          <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </Card>

        {/* Chat */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full flex flex-col">
            <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Team Chat
            </h3>

            {/* Messages */}
            <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-96">
              {messages.map(message => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">{message.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{message.sender}</span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
