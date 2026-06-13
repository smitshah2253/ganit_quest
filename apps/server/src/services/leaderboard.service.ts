import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { UserProgress } from '../entities/UserProgress';

export class LeaderboardService {
  static async getTopPlayers(limit: number = 20) {
    const userRepository = AppDataSource.getRepository(User);
    
    const users = await userRepository
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
      .limit(limit)
      .getRawMany();

    return users.map((row: any, index: number) => ({
      rank: index + 1,
      id: row.user_id,
      name: row.user_name,
      xp: Number(row.xp),
      stars: Number(row.stars),
      completedCount: 0,
    }));
  }
}
