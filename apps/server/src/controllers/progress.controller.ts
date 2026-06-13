import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ProgressService } from '../services/progress.service';

export class ProgressController {
  static async getProgress(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const progress = await ProgressService.getProgress(req.user.id);
      return res.json(progress);
    } catch (error) {
      console.error('GET /progress error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async syncProgress(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.user.id;
      const { xp, stars, completedLevels, unlockedLevels } = req.body;

      await ProgressService.syncProgress(userId, { xp, stars, completedLevels, unlockedLevels });

      return res.json({ message: 'Progress saved' });
    } catch (error) {
      console.error('POST /progress/sync error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
