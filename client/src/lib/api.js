import axios from "axios";
import { useAuth } from "../store/useAuth"; // ✅ import here

// Base API URL
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Axios instance
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // only needed if you use cookies/sessions
});

// Function to set/remove auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

// Initialize auth token from storage
const token = localStorage.getItem('authToken');
if (token) {
  setAuthToken(token);
  // Try to get user data
  api.get('/api/auth/me').catch(() => {
    // If the token is invalid, clear it
    setAuthToken(null);
  });
}

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      const auth = useAuth.getState();
      auth.logout();
    }
    return Promise.reject(error);
  }
);
