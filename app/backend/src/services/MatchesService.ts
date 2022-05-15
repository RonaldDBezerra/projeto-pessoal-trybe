import { validateToken } from '../utils/Token';
import MatchModel from '../database/models/Match';
import TeamModel from '../database/models/Team';
import Imatch from '../Interface/Match';

export default class MatchesService {
  constructor(private matchModel = MatchModel) {}

  public getMatches = async () => {
    const matchesArray = await this.matchModel.findAll({
      include:
      [
        { model: TeamModel, as: 'teamHome', attributes: ['teamName'] },
        { model: TeamModel, as: 'teamAway', attributes: ['teamName'] },
      ] });
    return matchesArray;
  };

  getMatchByInprogress = async (inProgress: string | undefined) => {
    if (!inProgress) {
      return this.getMatches();
    }

    const progressNumber = (inProgress === 'true') ? 1 : 0;

    const match = await this.matchModel.findAll({
      where: { inProgress: progressNumber },
      include:
      [
        { model: TeamModel, as: 'teamHome', attributes: ['teamName'] },
        { model: TeamModel, as: 'teamAway', attributes: ['teamName'] },
      ] });

    return match;
  };

  addMatches = async (add: Imatch, token: string) => {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = add;

    validateToken(token);

    const match = await this.matchModel.create({
      homeTeam,
      homeTeamGoals,
      awayTeam,
      awayTeamGoals,
      inProgress: 1,
    });

    return match;
  };

  matchFinished = async (id: string) => {
    await this.matchModel.update({ inProgress: false }, { where: { id } });
  };

  updateMatch = async (id: string, update: Imatch) => {
    const { homeTeamGoals, awayTeamGoals } = update;

    await this.matchModel.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
  };
}
