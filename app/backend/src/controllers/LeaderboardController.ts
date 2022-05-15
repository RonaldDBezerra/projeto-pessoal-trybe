import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  getLeaderboardHome = async (req: Request, res: Response) => {
    const retorno = await this.leaderboardService.leaderboardHome();

    return res.status(200).json(retorno);
  };
}
