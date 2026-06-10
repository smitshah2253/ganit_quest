import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, Zap, Medal } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LeaderboardEntry {
  rank: number;
  id: number;
  name: string;
  xp: number;
  stars: number;
  completedCount: number;
}

const RANK_STYLES: Record<number, { bg: string; border: string; badge: string; icon: React.ReactNode }> = {
  1: { bg: 'bg-amber-50',   border: 'border-amber-300',  badge: 'bg-amber-500 text-white',   icon: <Trophy className="w-4 h-4 text-amber-500" /> },
  2: { bg: 'bg-slate-50',   border: 'border-slate-300',  badge: 'bg-slate-500 text-white',   icon: <Medal  className="w-4 h-4 text-slate-400" /> },
  3: { bg: 'bg-orange-50',  border: 'border-orange-300', badge: 'bg-orange-500 text-white',  icon: <Medal  className="w-4 h-4 text-orange-500" /> },
};

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

export const LeaderboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_URL}/leaderboard`);
        setEntries(res.data);
      } catch {
        setError('Could not load leaderboard. Check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [token]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-slate-800 p-4 sm:p-6 md:p-10 overflow-y-auto relative select-none pt-20">
      {/* Ambient glows */}
      <div className="absolute top-0 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-40 h-40 sm:w-[30rem] sm:h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-all font-semibold bg-white/80 backdrop-blur px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 bg-amber-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-amber-200">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            <span className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider">Hall of Fame</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-700 bg-clip-text text-transparent">
            Leaderboard
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Top players ranked by XP earned</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-slate-500 text-sm">{error}</div>
        )}

        <AnimatePresence>
          {!loading && !error && (
            <div className="space-y-3">
              {entries.length === 0 && (
                <p className="text-center text-slate-500 py-10 text-sm">No players yet. Be the first!</p>
              )}
              {entries.map((entry, idx) => {
                const style = RANK_STYLES[entry.rank];
                const isCurrentUser = currentUser?.id === entry.id;

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all ${
                      style
                        ? `${style.bg} ${style.border} shadow-sm`
                        : isCurrentUser
                          ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                          : 'bg-white/70 border-slate-200/80'
                    } ${isCurrentUser ? 'ring-2 ring-indigo-400/50' : ''}`}
                  >
                    {/* Rank badge */}
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                      style ? style.badge : 'bg-slate-100 text-slate-600'
                    }`}>
                      {entry.rank <= 3 ? style.icon : `#${entry.rank}`}
                    </div>

                    {/* Avatar */}
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      isCurrentUser ? 'bg-indigo-500 text-white' : 'bg-gradient-to-br from-orange-400 to-indigo-500 text-white'
                    }`}>
                      {getInitials(entry.name)}
                    </div>

                    {/* Name + completed */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm sm:text-base truncate ${isCurrentUser ? 'text-indigo-700' : 'text-slate-800'}`}>
                        {entry.name}{isCurrentUser ? ' (You)' : ''}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                        {entry.completedCount} levels completed
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-orange-500" />
                        <span className="text-sm sm:text-base font-black text-slate-800">{entry.xp.toLocaleString()}</span>
                        <span className="text-[9px] text-slate-400 font-semibold">XP</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-slate-600">{entry.stars}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
