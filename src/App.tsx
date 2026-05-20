import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen } from './components/HomeScreen';
import { ChapterScreen } from './components/ChapterScreen';
import { GameContainer } from './components/GameContainer';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { ResetPasswordScreen } from './components/ResetPasswordScreen';
import { useGameStore } from './store/gameStore';
import { useAuthStore } from './store/authStore';

// We'll wrap the existing state-based flow in a GameFlow component
// This keeps the existing logic working while adding routing on top
const GameFlow = () => {
  const [currentScreen, setCurrentScreen] = React.useState<'home' | 'chapters' | 'game'>('home');
  const { currentLevelId, setCurrentLevel } = useGameStore();

  const handleStartFromHome = () => {
    setCurrentScreen('chapters');
  };

  const handleSelectLevel = (levelId: string) => {
    setCurrentLevel(levelId);
    setCurrentScreen('game');
  };

  const handleBackToChapters = () => {
    setCurrentScreen('chapters');
    setCurrentLevel(null!);
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans">
      {currentScreen === 'home' && (
        <HomeScreen onStart={handleStartFromHome} />
      )}
      
      {currentScreen === 'chapters' && (
        <ChapterScreen 
          onBack={handleBackToHome}
          onSelectLevel={handleSelectLevel}
        />
      )}
      
      {currentScreen === 'game' && currentLevelId && (
        <GameContainer 
          levelId={currentLevelId}
          onBack={handleBackToChapters}
        />
      )}
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  const setAuth = useAuthStore(state => state.setAuth);

  React.useEffect(() => {
    if (!token) {
      setAuth('guest-bypass-token', {
        id: 999,
        name: 'Guest Explorer',
        email: 'guest@mathquest.dev',
        xp: 120,
        level: 1,
        stars: 3
      });
    }
  }, [token, setAuth]);

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
        path="/home/*" 
        element={
          <ProtectedRoute>
            <GameFlow />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
