import TeamsModel from '../database/models/Team';

export default class TeamsService {
  constructor(private teamsModel = TeamsModel) {}

  getTeams = async () => {
    const teamsArray = await this.teamsModel.findAll();

    return teamsArray;
  };

  getTeamById = async (id: string) => {
    const team = await this.teamsModel.findOne({
      where: { id },
    });

    return team;
  };
}
