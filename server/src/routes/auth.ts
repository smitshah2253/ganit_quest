import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import pool from '../db';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId: number, email: string) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'supersecretjwttoken', {
    expiresIn: '7d'
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const [existingUsers]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result]: any = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const token = generateToken(result.insertId, email);

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { id: result.insertId, name, email, xp: 0, level: 1, stars: 0 }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    
    if (!user.password) {
      return res.status(401).json({ error: 'Please login with Google' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, xp: user.xp, level: user.level, stars: user.stars }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { email, name, sub: googleId } = payload;

    let [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    let user;
    if (users.length === 0) {
      // Create new user
      const [result]: any = await pool.query(
        'INSERT INTO users (name, email, google_id) VALUES (?, ?, ?)',
        [name, email, googleId]
      );
      user = { id: result.insertId, name, email, xp: 0, level: 1, stars: 0 };
    } else {
      user = users[0];
      // Update google ID if not set
      if (!user.google_id) {
        await pool.query('UPDATE users SET google_id = ? WHERE email = ?', [googleId, email]);
      }
    }

    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Google login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, xp: user.xp, level: user.level, stars: user.stars }
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
    }

    // Generate a secure reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?', 
      [resetToken, resetTokenExpiry, email]
    );

    // In a real app, send an email here using nodemailer.
    console.log(`[EMAIL MOCK] Password reset link for ${email}: http://localhost:5173/reset-password?token=${resetToken}`);

    res.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()', 
      [token]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?', 
      [hashedPassword, user.id]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
