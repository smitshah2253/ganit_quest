import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ResetPasswordScreen = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!token) {
      return setError('Invalid or missing reset token');
    }

    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
      setMessage(res.data.message || 'Password reset successfully');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4 relative overflow-hidden select-none">
      {/* Decorative saffron & indigo highlights */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl border border-slate-200/80 overflow-hidden relative z-10"
      >
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-slate-850 text-center mb-4 tracking-tight"
          >
            New Password
          </motion.h2>
          <p className="text-slate-500 text-center text-xs mb-8 font-semibold">
            Please enter your new password below.
          </p>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-650 text-sm text-center font-medium">
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center font-semibold">
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-wider">NEW PASSWORD</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-semibold"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-wider">CONFIRM PASSWORD</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-semibold"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit" 
              disabled={loading || !!message}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-indigo-600 hover:from-orange-500 hover:to-indigo-500 transition-all shadow-md shadow-orange-500/20 disabled:opacity-70 text-base uppercase tracking-wider cursor-pointer"
            >
              {loading ? 'SAVING...' : 'UPDATE PASSWORD'}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-xs font-semibold text-slate-500">
            Remembered it? {' '}
            <Link to="/login" className="text-orange-600 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default ResetPasswordScreen;
