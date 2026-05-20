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
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div className="relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-3 tracking-tight">
              Reset Password
            </h2>
          </motion.div>
          
          <p className="text-gray-500 text-center text-sm mb-8 font-medium px-4">
            Enter your email and we'll send you instructions to reset your password.
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm text-center font-medium"
            >
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-2 tracking-wide uppercase">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                placeholder="student@school.com"
                required
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-70 text-lg"
            >
              {loading ? 'Sending Instructions...' : 'Reset Password'}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Remember your password? {' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
