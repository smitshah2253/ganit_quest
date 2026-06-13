import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { syncProgressSchema } from '../validations/progressSchemas';
import { ProgressController } from '../controllers/progress.controller';

const router = Router();

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
router.get('/', authenticateToken, ProgressController.getProgress);

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
router.post('/sync', authenticateToken, validate(syncProgressSchema), ProgressController.syncProgress);

export default router;
