export interface Chat {
  id: string;
  participants: string[]; // User IDs of chat participants
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  
  // These fields are used for display in the UI
  username?: string;
  profileImage?: string;
  isOnline?: boolean;
  lastSeen?: string;
}