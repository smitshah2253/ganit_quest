import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message || 'If an account exists, a reset link has been sent.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-3 sm:p-4 relative overflow-hidden select-none">
      {/* Decorative saffron & indigo highlights */}
      <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-56 h-56 sm:w-80 sm:h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl border border-slate-200/80 overflow-hidden relative z-10"
      >
        <div className="relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-slate-850 text-center mb-2 sm:mb-3 tracking-tight">
              Reset Password
            </h2>
          </motion.div>
          
          <p className="text-slate-500 text-center text-[10px] sm:text-xs mb-6 sm:mb-8 font-semibold px-3 sm:px-4">
            Enter your email and we'll send you instructions to reset your password.
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-650 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center font-semibold"
            >
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-slate-700 text-[10px] sm:text-xs font-bold mb-1.5 sm:mb-2 tracking-wide uppercase">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-3 sm:py-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-semibold text-sm sm:text-base"
                placeholder="student@school.com"
                required
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-indigo-600 hover:from-orange-500 hover:to-indigo-500 transition-all shadow-md shadow-orange-500/20 disabled:opacity-70 text-sm sm:text-base uppercase tracking-wider cursor-pointer"
            >
              {loading ? 'Sending Instructions...' : 'Reset Password'}
            </motion.button>
          </form>

          <p className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs font-semibold text-slate-500">
            Remember your password? {' '}
            <Link to="/login" className="text-orange-600 font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default ForgotPasswordScreen;
