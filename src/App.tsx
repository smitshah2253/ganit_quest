import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { ForgotPasswordScreen } from './components/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from './components/auth/ResetPasswordScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ChapterScreen } from './components/screens/ChapterScreen';
import { ChapterIntroScreen } from './components/screens/ChapterIntroScreen';
import { LevelGridScreen } from './components/screens/LevelGridScreen';
import { GameContainer } from './components/GameContainer';
import { useAuthStore } from './store/authStore';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />
      
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chapters" 
        element={
          <ProtectedRoute>
            <ChapterScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chapter/:chapterId" 
        element={
          <ProtectedRoute>
            <ChapterIntroScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chapter/:chapterId/levels" 
        element={
          <ProtectedRoute>
            <LevelGridScreen />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chapter/:chapterId/level/:levelId" 
        element={
          <ProtectedRoute>
            <GameContainer />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
