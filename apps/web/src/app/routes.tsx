import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { GradeSelectionPage } from '@/features/home/pages/GradeSelectionPage';
import { ChapterListPage } from '@/features/chapters/pages/ChapterListPage';
import { ChapterIntroPage } from '@/features/chapters/pages/ChapterIntroPage';
import { LevelGridPage } from '@/features/chapters/pages/LevelGridPage';
import { GameContainer } from '@/features/game/components/GameContainer';
import { LeaderboardPage } from '@/features/leaderboard/pages/LeaderboardPage';
import { LearnPage } from '@/features/learn/pages/LearnPage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/grades" 
        element={
          <ProtectedRoute>
            <GradeSelectionPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/leaderboard" 
        element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chapters" 
        element={
          <ProtectedRoute>
            <ChapterListPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chapter/:chapterId" 
        element={
          <ProtectedRoute>
            <ChapterIntroPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chapter/:chapterId/levels" 
        element={
          <ProtectedRoute>
            <LevelGridPage />
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
      <Route 
        path="/learn/:chapterId" 
        element={
          <ProtectedRoute>
            <LearnPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};
