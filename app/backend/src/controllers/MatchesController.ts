import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  constructor(private matchesService = new MatchesService()) {}

  getMatches = async (req: Request, res: Response) => {
    const { inProgress } = req.query;

    const matchesArray = await
    this.matchesService.getMatchByInprogress(inProgress as string | undefined);

    return res.status(200).json(matchesArray);
  };

  addMatches = async (req: Request, res: Response) => {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress } = req.body;

    const token = req.headers.authorization || '';

    const match = await this.matchesService.addMatches({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress,
    }, token);

    return res.status(201).json(match);
  };

  matchFinished = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.matchesService.matchFinished(id);

    return res.status(200).json({});
  };

  updateMatch = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    await this.matchesService.updateMatch(id, {
      homeTeamGoals,
      awayTeamGoals,
    });

    return res.status(200).json({});
  };
}
