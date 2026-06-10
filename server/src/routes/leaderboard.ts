import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { UserProgress } from '../entities/UserProgress';

const router = Router();

const userRepository = () => AppDataSource.getRepository(User);
const progressRepository = () => AppDataSource.getRepository(UserProgress);

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Get top 20 players by XP
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: Leaderboard retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rank:
 *                     type: integer
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   xp:
 *                     type: integer
 *                   stars:
 *                     type: integer
 *                   completedCount:
 *                     type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/', async (_req, res) => {
  try {
    // Get users with their progress using QueryBuilder
    const users = await userRepository()
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        UserProgress,
        'progress',
        'progress.userId = user.id'
      )
      .select([
        'user.id',
        'user.name',
        'COALESCE(progress.xp, user.xp) as xp',
        'COALESCE(progress.stars, user.stars) as stars',
      ])
      .orderBy('xp', 'DESC')
      .addOrderBy('stars', 'DESC')
      .limit(20)
      .getRawMany();

    const leaderboard = users.map((row: any, index: number) => ({
      rank: index + 1,
      id: row.user_id,
      name: row.user_name,
      xp: Number(row.xp),
      stars: Number(row.stars),
      completedCount: 0, // Would need to calculate from progress.completedLevels
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('GET /leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
