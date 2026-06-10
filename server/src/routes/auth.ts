import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { UserProgress } from '../entities/UserProgress';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '../validations/authSchemas';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Get repositories
const userRepository = () => AppDataSource.getRepository(User);
const progressRepository = () => AppDataSource.getRepository(UserProgress);

const generateToken = (userId: number, email: string) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'supersecretjwttoken', {
    expiresIn: '7d',
  });
};

const ensureProgressRow = async (userId: number) => {
  const existingProgress = await progressRepository().findOne({
    where: { userId },
  });

  if (!existingProgress) {
    const progress = progressRepository().create({
      userId,
      xp: 0,
      stars: 0,
      completedLevels: [],
      unlockedLevels: [],
    });
    await progressRepository().save(progress);
  }
};

const getProgress = async (userId: number) => {
  const progress = await progressRepository().findOne({
    where: { userId },
  });

  if (!progress) {
    return { xp: 0, stars: 0, completedLevels: [], unlockedLevels: [] };
  }

  return {
    xp: progress.xp,
    stars: progress.stars,
    completedLevels: progress.completedLevels ?? [],
    unlockedLevels: progress.unlockedLevels ?? [],
  };
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await userRepository().findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository().create({
      name,
      email,
      password: hashedPassword,
      xp: 0,
      level: 1,
      stars: 0,
    });

    const savedUser = await userRepository().save(user);
    const token = generateToken(savedUser.id, savedUser.email);
    await ensureProgressRow(savedUser.id);
    const progress = await getProgress(savedUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        xp: savedUser.xp,
        level: savedUser.level,
        stars: savedUser.stars,
      },
      progress,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository().findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.password) {
      return res.status(401).json({ error: 'Please login with Google' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.email);
    await ensureProgressRow(user.id);
    const progress = await getProgress(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        stars: user.stars,
      },
      progress,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login with Google OAuth
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Google OAuth access token
 *     responses:
 *       200:
 *         description: Google login successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/google', validate(googleAuthSchema), async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { email, name, sub: googleId } = payload;

    let user = await userRepository().findOne({ where: { email } });

    if (!user) {
      // Create new user
      const newUser = userRepository().create({
        name: name || 'Google User',
        email,
        googleId,
        xp: 0,
        level: 1,
        stars: 0,
      });
      user = await userRepository().save(newUser);
    } else {
      // Update google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await userRepository().save(user);
      }
    }

    const token = generateToken(user.id, user.email);
    await ensureProgressRow(user.id);
    const progress = await getProgress(user.id);

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        stars: user.stars,
      },
      progress,
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset link sent
 *       500:
 *         description: Internal server error
 */
router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userRepository().findOne({ where: { email } });

    if (user) {
      // Generate a secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await userRepository().save(user);

      // In a real app, send an email here using nodemailer.
      console.log(`[EMAIL MOCK] Password reset link for ${email}: http://localhost:5173/reset-password?token=${resetToken}`);
    }

    res.json({ message: 'If an account with this email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await userRepository().findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now()),
      },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await userRepository().save(user);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile with rank and progress
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await userRepository()
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.xp', 'user.level', 'user.stars'])
      .where('user.id = :id', { id: req.user.id })
      .getOne();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await ensureProgressRow(user.id);
    const progress = await getProgress(user.id);

    // Calculate rank
    const rankResult = await userRepository()
      .createQueryBuilder('user')
      .where('user.xp > :xp', { xp: user.xp })
      .getCount();

    const rank = rankResult + 1;

    res.json({ ...user, rank, progress });
  } catch (error) {
    console.error('GET /me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/profile:
 *   patch:
 *     summary: Update user profile (name)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/profile', authenticateToken, validate(updateProfileSchema), async (req: AuthRequest, res) => {
  try {
    const { name } = req.body;

    const user = await userRepository().findOne({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name.trim();
    await userRepository().save(user);

    const updated = await userRepository()
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.xp', 'user.level', 'user.stars'])
      .where('user.id = :id', { id: user.id })
      .getOne();

    res.json({ message: 'Profile updated', user: updated });
  } catch (error) {
    console.error('PATCH /profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
