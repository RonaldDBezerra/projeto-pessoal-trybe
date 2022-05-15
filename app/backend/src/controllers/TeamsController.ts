import { Request, Response } from 'express';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  constructor(private teamsService = new TeamsService()) {}

  getTeams = async (req: Request, res: Response) => {
    const teamsArray = await this.teamsService.getTeams();

    return res.status(200).json(teamsArray);
  };

  getTeamById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const team = await this.teamsService.getTeamById(id);

    return res.status(200).json(team);
  };
}
