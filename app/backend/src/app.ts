import * as express from 'express';
import * as cors from 'cors';
import userRouter from './routes/UserRouter';
import teamsRouter from './routes/TeamsRouter';
import matchesRouter from './routes/MatchesRouter';
import leaderboardRouter from './routes/LeaderboardRouter';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.app.use(cors());

    this.app.use(express.json());

    this.app.use('/login', userRouter);

    this.app.use('/teams', teamsRouter);

    this.app.use('/matches', matchesRouter);

    this.app.use('/leaderboard', leaderboardRouter);

    this.config();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,DELETE,OPTIONS,PUT,PATCH',
      );
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
