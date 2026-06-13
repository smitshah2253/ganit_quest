import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AuthService } from '../services/auth.service';

const formatUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  xp: user.xp,
  level: user.level,
  stars: user.stars,
});

export class AuthController {
  static async register(req: AuthRequest, res: Response) {
    try {
      const { token, user, progress } = await AuthService.register(req.body);
      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: formatUser(user),
        progress,
      });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Registration error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req: AuthRequest, res: Response) {
    try {
      const { token, user, progress } = await AuthService.login(req.body);
      return res.json({
        message: 'Login successful',
        token,
        user: formatUser(user),
        progress,
      });
    } catch (error: any) {
      if (error.message.includes('Invalid') || error.message.includes('Google')) {
        return res.status(401).json({ error: error.message });
      }
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async googleAuth(req: AuthRequest, res: Response) {
    try {
      const { token, user, progress } = await AuthService.googleLogin(req.body.credential);
      return res.json({
        message: 'Google login successful',
        token,
        user: formatUser(user),
        progress,
      });
    } catch (error: any) {
      if (error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Google Auth error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async forgotPassword(req: AuthRequest, res: Response) {
    try {
      await AuthService.forgotPassword(req.body.email);
      return res.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async resetPassword(req: AuthRequest, res: Response) {
    try {
      await AuthService.resetPassword(req.body);
      return res.json({ message: 'Password reset successfully' });
    } catch (error: any) {
      if (error.message.includes('Invalid or expired')) {
        return res.status(400).json({ error: error.message });
      }
      console.error('Reset password error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });
      
      const profile = await AuthService.getProfile(req.user.id);
      return res.json(profile);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('GET /me error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });

      const updated = await AuthService.updateProfile(req.user.id, req.body.name);
      return res.json({ message: 'Profile updated', user: updated });
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      console.error('PATCH /profile error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
