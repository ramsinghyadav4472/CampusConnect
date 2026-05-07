import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking stored session
    const stored = localStorage.getItem('cc_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data);
      localStorage.setItem('cc_user', JSON.stringify(res.data));
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      setUser(res.data);
      localStorage.setItem('cc_user', JSON.stringify(res.data));
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const googleLogin = async (token) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', { token });
      setUser(res.data);
      localStorage.setItem('cc_user', JSON.stringify(res.data));
      setLoading(false);
      return res.data;
    } catch (error) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cc_user');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('cc_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
