import { api } from './api';

export const chatService = {
  getConversations: async () => {
    const res = await api.get('/chats');
    return res.data;
  },

  getMessages: async (userId) => {
    const res = await api.get(`/chats/${userId}`);
    return res.data;
  },

  sendMessage: async (receiverId, text, bookId = null) => {
    const res = await api.post('/chats', { receiverId, text, bookId });
    return res.data;
  }
};
