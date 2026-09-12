import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dt_token') || null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('dt_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('dt_token', data.token);
      setToken(data.token);
      setUser(data.user);
      addToast(`Welcome back, ${data.user.name}`, 'success');
      return { success: true, user: data.user };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or credentials';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('dt_token', data.token);
      setToken(data.token);
      setUser(data.user);
      addToast(`Account created successfully. Welcome to Dazzling Threads!`, 'success');
      return { success: true, user: data.user };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('dt_token');
    setToken(null);
    setUser(null);
    addToast('You have been logged out gracefully', 'info');
  };

  const updateProfile = async (formData) => {
    try {
      const { data } = await api.put('/auth/profile', formData);
      setUser(prev => ({ ...prev, ...data.user }));
      addToast('Profile updated successfully', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      addToast(msg, 'error');
      return { success: false };
    }
  };

  const addAddress = async (addressData) => {
    try {
      const { data } = await api.post('/auth/addresses', addressData);
      setUser(prev => ({ ...prev, addresses: data.addresses }));
      addToast('Address added to your address book', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add address';
      addToast(msg, 'error');
      return { success: false };
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const { data } = await api.delete(`/auth/addresses/${addressId}`);
      setUser(prev => ({ ...prev, addresses: data.addresses }));
      addToast('Address removed', 'info');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete address';
      addToast(msg, 'error');
      return { success: false };
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
