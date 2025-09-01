import { useEffect } from 'react';
import { useAuth } from '../store/useAuth';

export function AuthProvider({ children }) {
  const { checkAuth, logout } = useAuth();

  useEffect(() => {
    // Try to restore the session when component mounts
    const token = sessionStorage.getItem('temp-auth-token');
    if (token) {
      checkAuth();
    } else {
      // If no token in sessionStorage, ensure we're logged out
      logout();
    }

    // Add event listener for page refresh/unload
    const handleBeforeUnload = () => {
      // Clear auth on page refresh
      sessionStorage.removeItem('temp-auth-token');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [checkAuth, logout]);

  return children;
}
