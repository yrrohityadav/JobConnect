import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
      setProfile(data.data.profile);
    } catch {
      localStorage.removeItem('accessToken');
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.data.accessToken);
    setUser(data.data.user);
    await fetchUser(); // get full profile
    toast.success('Login successful!');
    return data.data.user;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    toast.success(data.message);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('accessToken');
    setUser(null);
    setProfile(null);
    toast.success('Logged out');
  };

  const value = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    fetchUser,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
