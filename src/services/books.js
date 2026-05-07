import { api } from './api';

export const booksService = {
  // Fetch all books (with optional filters)
  getAll: async (filters = {}) => {
    const res = await api.get('/books', { params: filters });
    return res.data.books || res.data;
  },

  // Fetch a single book by ID
  getById: async (id) => {
    const res = await api.get(`/books/${id}`);
    return res.data;
  },

  // Create a new book listing
  create: async (bookData) => {
    const res = await api.post('/books', bookData);
    return res.data;
  },

  // Update a book listing
  update: async (id, bookData) => {
    const res = await api.put(`/books/${id}`, bookData);
    return res.data;
  },

  // Delete a book listing
  delete: async (id) => {
    const res = await api.delete(`/books/${id}`);
    return res.data;
  },

  // Toggle wishlist status (optional, needs backend support if not implemented)
  toggleWishlist: async (bookId) => {
    const res = await api.post(`/books/${bookId}/wishlist`);
    return res.data;
  }
};
