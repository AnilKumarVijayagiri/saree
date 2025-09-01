import { create } from 'zustand'
import { api, setAuthToken } from '../lib/api'

export const useAuth = create((set) => ({
  user: null,
  token: null,
  initialized: false,
  loading: true,
  async login(data) {
    set({ 
      user: {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      }, 
      token: data.token,
      initialized: true,
      loading: false
    });
    // Store only the token in sessionStorage (clears on tab close)
    sessionStorage.setItem('temp-auth-token', data.token);
    setAuthToken(data.token);
  },
  logout() {
    set({ user: null, token: null, initialized: true, loading: false });
    sessionStorage.removeItem('temp-auth-token');
    setAuthToken(null);
  },
  async checkAuth() {
    try {
      set({ loading: true });
      const token = sessionStorage.getItem('temp-auth-token');
      if (!token) {
        throw new Error('No token found');
      }
      setAuthToken(token);
      const { data } = await api.get('/api/auth/me');
      set({ 
        user: {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        }, 
        token,
        initialized: true,
        loading: false
      });
    } catch (error) {
      console.log('Auth check failed:', error);
      set({ user: null, token: null, initialized: true, loading: false });
      sessionStorage.removeItem('temp-auth-token');
      setAuthToken(null);
    }
  }
}))
