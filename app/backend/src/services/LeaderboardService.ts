import MatchModel from '../database/models/Match';
import TeamModel from '../database/models/Team';

export default class LeaderboardService {
  constructor(private matchModel = MatchModel) {}

  private _criaClassificacao = () => {
    const classificacao = {
      name: '',
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    };
    return classificacao;
  };

  private _getTeamsPlayHome = async () => {
    const matchesArray = await this.matchModel.findAll();
    const teamsArray = await TeamModel.findAll();

    const allMatchesHome = teamsArray.map(async (team) => {
      const { teamName, id } = team;

      const homeMatch = matchesArray.filter(
        (match) => match.homeTeam === id && match.inProgress === 0,
      );

      return { teamName, homeMatch };
    });

    return Promise.all(allMatchesHome);
  };

  private _eficiencia = (totalPoints: number, totalGames: number) => {
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

    return Number(efficiency);
  };

  private _geraClassificacao = async () => {
    const matches = await this._getTeamsPlayHome();

    const classificacaoCamp = matches.map(({ teamName, homeMatch }) => {
      const board = this._criaClassificacao();

      homeMatch.forEach(({ homeTeamGoals, awayTeamGoals }) => {
        board.goalsFavor += homeTeamGoals;
        board.goalsOwn += awayTeamGoals;
        board.totalVictories += homeTeamGoals > awayTeamGoals ? 1 : 0;
        board.totalLosses += homeTeamGoals < awayTeamGoals ? 1 : 0;
        board.totalDraws += homeTeamGoals === awayTeamGoals ? 1 : 0;
      });

      board.name = teamName;
      board.totalGames = homeMatch.length;
      board.goalsBalance = board.goalsFavor - board.goalsOwn;
      board.totalPoints = board.totalVictories * 3 + board.totalDraws * 1;
      board.efficiency = this._eficiencia(board.totalPoints, board.totalGames);
      return board;
    });

    return Promise.all(classificacaoCamp);
  };

  private _ordenaClassificacao = async (board: Array<any>) => {
    const sortedBoard = board.sort((team1, team2) => {
      if (team1.totalPoints > team2.totalPoints) return -1;
      if (team1.totalPoints < team2.totalPoints) return 1;

      if (team1.totalVictories > team2.totalVictories) return -1;
      if (team1.totalVictories < team2.totalVictories) return 1;

      if (team1.goalsBalance > team2.goalsBalance) return -1;
      if (team1.goalsBalance < team2.goalsBalance) return 1;

      if (team1.goalsFavor > team2.goalsFavor) return -1;
      if (team1.goalsFavor < team2.goalsFavor) return 1;

      if (team1.goalsOwn > team2.goalsOwn) return -1;
      if (team1.goalsOwn < team2.goalsOwn) return 1;

      return 0;
    });

    return sortedBoard;
  };

  private _classificacaoOrdenada = async () => {
    const classificacaoCampOrdenada = await this._ordenaClassificacao(
      await this._geraClassificacao(),
    );

    return Promise.all(classificacaoCampOrdenada);
  };

  leaderboardHome = async () => {
    const retorno = await this._classificacaoOrdenada();

    return retorno;
  };
}
