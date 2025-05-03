import { useState, useEffect } from 'react';
import { Chat } from '@/types/chat';

const mockChats: Chat[] = [
  {
    id: 'chat1',
    participants: ['1', '5'],
    lastMessage: 'Hey, how are you doing?',
    lastMessageTime: new Date('2023-08-12T10:30:00').toISOString(),
    unreadCount: 0,
    username: 'Emma',
    profileImage: 'https://randomuser.me/api/portraits/women/64.jpg',
    isOnline: true,
    lastSeen: new Date('2023-08-12T10:30:00').toISOString(),
  },
  {
    id: 'chat2',
    participants: ['1', '4'],
    lastMessage: 'Let me know when you\'re free',
    lastMessageTime: new Date('2023-08-11T15:45:00').toISOString(),
    unreadCount: 3,
    username: 'Morgan',
    profileImage: 'https://randomuser.me/api/portraits/men/57.jpg',
    isOnline: false,
    lastSeen: new Date('2023-08-11T16:10:00').toISOString(),
  },
  {
    id: 'chat3',
    participants: ['1', '2'],
    lastMessage: 'That sounds amazing!',
    lastMessageTime: new Date('2023-08-05T20:15:00').toISOString(),
    unreadCount: 0,
    username: 'Samantha',
    profileImage: 'https://randomuser.me/api/portraits/women/43.jpg',
    isOnline: true,
    lastSeen: new Date('2023-08-12T09:45:00').toISOString(),
  },
  {
    id: 'chat4',
    participants: ['1', '3'],
    lastMessage: 'See you tomorrow at 6!',
    lastMessageTime: new Date('2023-08-01T18:22:00').toISOString(),
    unreadCount: 0,
    username: 'Taylor',
    profileImage: 'https://randomuser.me/api/portraits/women/91.jpg',
    isOnline: false,
    lastSeen: new Date('2023-08-10T12:15:00').toISOString(),
  },
  {
    id: 'chat5',
    participants: ['1', '7'],
    lastMessage: 'Haha, that was fun!',
    lastMessageTime: new Date('2023-07-28T21:05:00').toISOString(),
    unreadCount: 0,
    username: 'Jessica',
    profileImage: 'https://randomuser.me/api/portraits/women/33.jpg',
    isOnline: true,
    lastSeen: new Date('2023-08-12T08:30:00').toISOString(),
  },
];

export function useMockChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setChats(mockChats);
      setLoading(false);
    };

    loadChats();
  }, []);

  // Add a new chat
  const addChat = (chat: Chat) => {
    setChats(prevChats => {
      // Check if chat already exists
      const existingChat = prevChats.find(c => c.id === chat.id);
      if (existingChat) {
        return prevChats; // Don't add if it already exists
      }
      return [...prevChats, chat];
    });
  };

  // Update a chat's last message
  const updateLastMessage = (chatId: string, lastMessage: string, lastMessageTime: string, unreadCount: number = 0) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage, lastMessageTime, unreadCount: chat.unreadCount + unreadCount } 
          : chat
      )
    );
  };

  return { chats, loading, addChat, updateLastMessage };
}