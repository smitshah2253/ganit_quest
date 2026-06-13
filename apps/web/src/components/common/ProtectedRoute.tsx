import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  if (!token) return null;

  return <>{children}</>;
};
