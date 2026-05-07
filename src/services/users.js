import { api } from './api';

export const usersService = {
  // Get currently logged-in user profile
  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return res.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },

  // Admin: Get all users
  getAllUsers: async () => {
    // Optional: Implement admin route later if needed
    const res = await api.get('/users');
    return res.data;
  }
};
