import { AppDataSource } from '../data-source';
import { UserProgress } from '../entities/UserProgress';
import { User } from '../entities/User';

const progressRepository = () => AppDataSource.getRepository(UserProgress);
const userRepository = () => AppDataSource.getRepository(User);

export class ProgressService {
  /**
   * Ensure a progress row exists for a user. If not, create one.
   */
  static async ensureProgressRow(userId: number): Promise<void> {
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
  }

  /**
   * Get formatted progress for a user
   */
  static async getProgress(userId: number) {
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
  }

  /**
   * Sync progress from client to server
   */
  static async syncProgress(userId: number, payload: { xp: number; stars: number; completedLevels: string[]; unlockedLevels: string[] }) {
    const { xp, stars, completedLevels, unlockedLevels } = payload;

    let progress = await progressRepository().findOne({
      where: { userId },
    });

    if (progress) {
      progress.xp = xp;
      progress.stars = stars;
      progress.completedLevels = completedLevels;
      progress.unlockedLevels = unlockedLevels;
    } else {
      progress = progressRepository().create({
        userId,
        xp,
        stars,
        completedLevels,
        unlockedLevels,
      });
    }

    await progressRepository().save(progress);
    await userRepository().update(userId, { xp, stars });
  }
}
