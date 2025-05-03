import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/message';
import { Chat } from '@/types/chat';

// Updated chat data with new structure
const mockChatData: Record<string, {
  chat: Chat;
  messages: Message[];
}> = {
  'chat1': {
    chat: {
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
    messages: [
      {
        id: 'm1',
        senderId: '5',
        chatId: 'chat1',
        content: 'Hi there! I saw your profile and thought I\'d say hello.',
        timestamp: new Date('2023-08-10T14:22:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm2',
        senderId: '1',
        chatId: 'chat1',
        content: 'Hey Emma! Nice to meet you. How\'s your day going?',
        timestamp: new Date('2023-08-10T14:25:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm3',
        senderId: '5',
        chatId: 'chat1',
        content: 'It\'s going well! Just finished work and now relaxing. Are you new to the area?',
        timestamp: new Date('2023-08-10T14:30:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm4',
        senderId: '1',
        chatId: 'chat1',
        content: 'Yeah, moved here about a month ago. Still exploring all the cool spots!',
        timestamp: new Date('2023-08-10T14:33:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm5',
        senderId: '5',
        chatId: 'chat1',
        content: 'Oh nice! I know some great coffee shops if you\'re into that.',
        timestamp: new Date('2023-08-12T10:25:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm6',
        senderId: '1',
        chatId: 'chat1',
        content: 'Definitely! I\'m a big coffee fan. Would love some recommendations.',
        timestamp: new Date('2023-08-12T10:28:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm7',
        senderId: '5',
        chatId: 'chat1',
        content: 'Hey, how are you doing?',
        timestamp: new Date('2023-08-12T10:30:00').toISOString(),
        read: true,
        delivered: true,
      },
    ]
  },
  'chat2': {
    chat: {
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
    messages: [
      {
        id: 'm1',
        senderId: '4',
        chatId: 'chat2',
        content: 'Hey, I noticed we both like hiking!',
        timestamp: new Date('2023-08-11T15:30:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm2',
        senderId: '1',
        chatId: 'chat2',
        content: 'Yeah! Have you tried the trails at Mountain Creek?',
        timestamp: new Date('2023-08-11T15:35:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm3',
        senderId: '4',
        chatId: 'chat2',
        content: 'Not yet, but I\'ve heard great things. We should go sometime!',
        timestamp: new Date('2023-08-11T15:40:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm4',
        senderId: '4',
        chatId: 'chat2',
        content: 'Let me know when you\'re free',
        timestamp: new Date('2023-08-11T15:45:00').toISOString(),
        read: false,
        delivered: true,
      },
    ]
  },
  'chat3': {
    chat: {
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
    messages: [
      {
        id: 'm1',
        senderId: '1',
        chatId: 'chat3',
        content: 'Hey Samantha, I see you\'re into photography as well!',
        timestamp: new Date('2023-08-05T19:55:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm2',
        senderId: '2',
        chatId: 'chat3',
        content: 'Yes! Been doing it for about 5 years now. What kind of photos do you take?',
        timestamp: new Date('2023-08-05T20:00:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm3',
        senderId: '1',
        chatId: 'chat3',
        content: 'Mostly landscapes and street photography. I\'m planning a shoot at the waterfront this weekend.',
        timestamp: new Date('2023-08-05T20:10:00').toISOString(),
        read: true,
        delivered: true,
      },
      {
        id: 'm4',
        senderId: '2',
        chatId: 'chat3',
        content: 'That sounds amazing!',
        timestamp: new Date('2023-08-05T20:15:00').toISOString(),
        read: true,
        delivered: true,
      },
    ]
  }
};

// Let's define a hook to access all messages across chats
export function useMockChatMessages(chatId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Simulate loading messages from an API
    const loadMessages = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (chatId) {
          const chatData = mockChatData[chatId];
          if (chatData) {
            setMessages(chatData.messages);
            setChat(chatData.chat);
          } else {
            setMessages([]);
            setChat(null);
          }
        } else {
          // Load all messages across all chats
          const allMsgs: Message[] = [];
          Object.values(mockChatData).forEach(chatData => {
            allMsgs.push(...chatData.messages);
          });
          
          // Sort by timestamp
          allMsgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          setAllMessages(allMsgs);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, [chatId]);

  // Add a message to a chat
  const addMessage = (message: Message) => {
    // Add to the specific chat's messages
    setMessages(prev => [...prev, message]);
    
    // Also add to all messages
    setAllMessages(prev => {
      const newMessages = [...prev, message];
      // Sort by timestamp
      return newMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!chatId) return null;
    
    // Simulate sending a message
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: '1', // Current user ID
      chatId,
      content: text,
      timestamp: new Date().toISOString(),
      read: false,
      delivered: true,
    };
    
    addMessage(newMessage);
    
    // Simulate receiving a response after some time
    if (Math.random() > 0.3) { // 70% chance to get a response
      setTimeout(() => {
        const responseMessages = [
          "That's great!",
          "Sounds good to me.",
          "I'd love to hear more about that.",
          "Interesting! Tell me more.",
          "Cool! What are you up to now?",
          "Nice to hear from you!",
          "I was just thinking about that!",
          "Absolutely!",
          "Let's meet up soon!",
          "Haha, that's funny."
        ];
        
        const responseText = responseMessages[Math.floor(Math.random() * responseMessages.length)];
        
        // Get the other participant
        const otherParticipantId = mockChatData[chatId].chat.participants.find(p => p !== '1') || '2';
        
        const responseMessage: Message = {
          id: `m${Date.now() + 1}`,
          senderId: otherParticipantId,
          chatId,
          content: responseText,
          timestamp: new Date().toISOString(),
          read: true,
          delivered: true,
        };
        
        addMessage(responseMessage);
      }, 2000 + Math.random() * 3000); // Response after 2-5 seconds
    }
    
    return newMessage;
  }, [chatId]);

  return { messages: chatId ? messages : allMessages, chat, loading, sendMessage, addMessage };
}