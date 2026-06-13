import { Request, Response } from 'express';
import { LeaderboardService } from '../services/leaderboard.service';

export class LeaderboardController {
  static async getLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await LeaderboardService.getTopPlayers(20);
      return res.json(leaderboard);
    } catch (error) {
      console.error('GET /leaderboard error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
