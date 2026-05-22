import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError('Invalid email format');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
 
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      setAuth(res.data.token, res.data.user);
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(`${API_URL}/auth/google`, { credential: tokenResponse.access_token });
        setAuth(res.data.token, res.data.user);
        navigate('/home');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Google signup failed');
      }
    },
    onError: () => setError('Google signup failed'),
  });

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
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-2 tracking-tight bg-gradient-to-r from-orange-600 via-slate-800 to-indigo-700 bg-clip-text text-transparent">
              Join GanitQuest
            </h2>
            <p className="text-slate-500 text-[10px] sm:text-xs font-bold text-center uppercase tracking-widest mb-6 sm:mb-8">
              CBSE Class 10 Math Prep
            </p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-650 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-slate-700 text-[10px] sm:text-xs font-bold mb-1 tracking-wide uppercase">Player Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-semibold text-sm sm:text-base"
                placeholder="Awesome Student"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-[10px] sm:text-xs font-bold mb-1 tracking-wide uppercase">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-semibold text-sm sm:text-base"
                placeholder="student@school.com"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-[10px] sm:text-xs font-bold mb-1 tracking-wide uppercase">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-semibold text-sm sm:text-base"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-[10px] sm:text-xs font-bold mb-1 tracking-wide uppercase">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-semibold text-sm sm:text-base"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit" 
              disabled={loading}
              className="w-full mt-4 sm:mt-6 py-3.5 sm:py-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-indigo-600 hover:from-orange-500 hover:to-indigo-500 transition-all shadow-md shadow-orange-500/20 disabled:opacity-70 text-sm sm:text-base uppercase tracking-wider cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </motion.button>
          </form>

          <div className="mt-4 sm:mt-6 flex items-center justify-between">
            <div className="h-px w-full bg-slate-200"></div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-3 sm:px-4">OR</span>
            <div className="h-px w-full bg-slate-200"></div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => googleLogin()}
            type="button"
            className="mt-4 sm:mt-6 w-full py-3 px-4 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm cursor-pointer text-xs sm:text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </motion.button>

          <p className="mt-4 sm:mt-6 text-center text-[10px] sm:text-xs font-semibold text-slate-500">
            Already have an account? {' '}
            <Link to="/login" className="text-orange-600 font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default RegisterScreen;
