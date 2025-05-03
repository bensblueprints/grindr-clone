export interface Message {
  id: string;
  senderId: string;
  chatId: string;
  content: string;
  timestamp: string;
  read: boolean;
  delivered?: boolean;
  attachments?: {
    type: 'image' | 'location' | 'file';
    url: string;
  }[];
}