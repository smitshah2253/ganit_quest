import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { UserProgress } from '../entities/UserProgress';
import { User } from '../entities/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { syncProgressSchema } from '../validations/progressSchemas';

const router = Router();

const progressRepository = () => AppDataSource.getRepository(UserProgress);
const userRepository = () => AppDataSource.getRepository(User);

/**
 * @swagger
 * /progress:
 *   get:
 *     summary: Get user's saved progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User progress retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 xp:
 *                   type: integer
 *                 stars:
 *                   type: integer
 *                 completedLevels:
 *                   type: array
 *                   items:
 *                     type: string
 *                 unlockedLevels:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const progress = await progressRepository().findOne({
      where: { userId: req.user.id },
    });

    if (!progress) {
      return res.json({ xp: 0, stars: 0, completedLevels: [], unlockedLevels: [] });
    }

    res.json({
      xp: progress.xp,
      stars: progress.stars,
      completedLevels: progress.completedLevels ?? [],
      unlockedLevels: progress.unlockedLevels ?? [],
    });
  } catch (error) {
    console.error('GET /progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /progress/sync:
 *   post:
 *     summary: Sync user progress to server
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - xp
 *               - stars
 *               - completedLevels
 *               - unlockedLevels
 *             properties:
 *               xp:
 *                 type: integer
 *               stars:
 *                 type: integer
 *               completedLevels:
 *                 type: array
 *                 items:
 *                   type: string
 *               unlockedLevels:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Progress saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request (invalid payload)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/sync', authenticateToken, validate(syncProgressSchema), async (req: AuthRequest, res) => {
  try {
    const userId = req.user.id;
    const { xp, stars, completedLevels, unlockedLevels } = req.body;

    // Upsert progress
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

    // Update user stats
    await userRepository().update(userId, { xp, stars });

    res.json({ message: 'Progress saved' });
  } catch (error) {
    console.error('POST /progress/sync error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
