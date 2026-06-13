import { Router } from 'express';
import { LeaderboardController } from '../controllers/leaderboard.controller';

const router = Router();

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
router.get('/', LeaderboardController.getLeaderboard);

export default router;
