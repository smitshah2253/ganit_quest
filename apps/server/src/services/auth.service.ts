import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { ProgressService } from './progress.service';
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const userRepository = () => AppDataSource.getRepository(User);

export class AuthService {
  static generateToken(userId: number, email: string) {
    return jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'supersecretjwttoken', {
      expiresIn: '7d',
    });
  }

  static async register(data: any) {
    const { name, email, password } = data;

    const existingUser = await userRepository().findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists with this email');
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
    const token = this.generateToken(savedUser.id, savedUser.email);
    
    await ProgressService.ensureProgressRow(savedUser.id);
    const progress = await ProgressService.getProgress(savedUser.id);

    return { token, user: savedUser, progress };
  }

  static async login(data: any) {
    const { email, password } = data;

    const user = await userRepository().findOne({ where: { email } });
    if (!user) throw new Error('Invalid email or password');
    if (!user.password) throw new Error('Please login with Google');

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error('Invalid email or password');

    const token = this.generateToken(user.id, user.email);
    await ProgressService.ensureProgressRow(user.id);
    const progress = await ProgressService.getProgress(user.id);

    return { token, user, progress };
  }

  static async googleLogin(credential: string) {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new Error('Invalid Google token');

    const { email, name, sub: googleId } = payload;
    let user = await userRepository().findOne({ where: { email } });

    if (!user) {
      const newUser = userRepository().create({
        name: name || 'Google User',
        email,
        googleId,
        xp: 0,
        level: 1,
        stars: 0,
      });
      user = await userRepository().save(newUser);
    } else if (!user.googleId) {
      user.googleId = googleId;
      await userRepository().save(user);
    }

    const token = this.generateToken(user.id, user.email);
    await ProgressService.ensureProgressRow(user.id);
    const progress = await ProgressService.getProgress(user.id);

    return { token, user, progress };
  }

  static async forgotPassword(email: string) {
    const user = await userRepository().findOne({ where: { email } });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000);
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await userRepository().save(user);
      console.log(`[EMAIL MOCK] Password reset link for ${email}: http://localhost:5173/reset-password?token=${resetToken}`);
    }
    return true;
  }

  static async resetPassword(data: any) {
    const { token, newPassword } = data;

    const user = await userRepository().findOne({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await userRepository().save(user);
    return true;
  }

  static async getProfile(userId: number) {
    const user = await userRepository()
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.xp', 'user.level', 'user.stars'])
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) throw new Error('User not found');

    await ProgressService.ensureProgressRow(user.id);
    const progress = await ProgressService.getProgress(user.id);

    const rankResult = await userRepository()
      .createQueryBuilder('user')
      .where('user.xp > :xp', { xp: user.xp })
      .getCount();

    return { ...user, rank: rankResult + 1, progress };
  }

  static async updateProfile(userId: number, name: string) {
    const user = await userRepository().findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    user.name = name.trim();
    await userRepository().save(user);

    const updated = await userRepository()
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.email', 'user.xp', 'user.level', 'user.stars'])
      .where('user.id = :id', { id: user.id })
      .getOne();

    return updated;
  }
}
