import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/game.store';
import { useAuthStore } from '@/store/auth.store';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { SubscriptionBadge } from '@/features/subscription/components/SubscriptionBadge';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { xp, stars } = useGameStore();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show header on auth pages
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  if (isAuthPage) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 sm:p-4 pointer-events-none">
      <div className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-md pointer-events-auto">
        {user && (
          <>
            <span className="text-slate-700 font-semibold text-[10px] sm:text-xs truncate max-w-[80px] sm:max-w-[120px]">
              {user.name || 'Guest Explorer'}
            </span>
            <div className="w-px h-3 sm:h-4 bg-slate-200" />
          </>
        )}
        
        {/* XP */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-orange-600 font-semibold text-[10px] sm:text-xs tracking-wider uppercase hidden sm:inline">
            XP
          </span>
          <span className="font-bold text-slate-800 text-sm sm:text-base">{xp}</span>
        </div>
        
        <div className="w-px h-3 sm:h-4 bg-slate-200" />
        
        {/* Stars */}
        <div className="flex items-center gap-1">
          <span className="text-yellow-500 text-xs sm:text-sm">⭐</span>
          <span className="font-bold text-slate-800 text-sm sm:text-base">{stars}</span>
        </div>
        
        <div className="w-px h-3 sm:h-4 bg-slate-200" />
        
        {/* Leaderboard */}
        <button
          onClick={() => navigate('/leaderboard')}
          className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors"
          title={t('navigation.leaderboard')}
        >
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-xs font-semibold hidden sm:inline">
            {t('navigation.leaderboard')}
          </span>
        </button>
        
        <div className="w-px h-3 sm:h-4 bg-slate-200" />
        
        {/* Language Switcher */}
        <LanguageSwitcher />
        
        <div className="w-px h-3 sm:h-4 bg-slate-200" />
        
        {/* Subscription Badge */}
        <SubscriptionBadge />
        
        <div className="w-px h-3 sm:h-4 bg-slate-200" />
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors"
          title={t('navigation.logout')}
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-xs font-semibold hidden sm:inline">
            {t('navigation.logout')}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
