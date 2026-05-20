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
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold text-blue-600 text-center mb-4 tracking-tight"
          >
            New Password
          </motion.h2>
          <p className="text-gray-500 text-center text-sm mb-8">
            Please enter your new password below.
          </p>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center">
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wider">NEW PASSWORD</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wider">CONFIRM PASSWORD</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading || !!message}
              className="w-full py-3 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'SAVING...' : 'UPDATE PASSWORD'}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Remembered it? {' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
