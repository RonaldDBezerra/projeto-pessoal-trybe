import * as express from 'express';
import TeamsController from '../controllers/TeamsController';
// import middleware from '../middlewares/middleware';
import TeamsService from '../services/TeamsService';

const teamsRouter = express.Router();

const teamsController = new TeamsController(new TeamsService());

teamsRouter.get('/', teamsController.getTeams);

teamsRouter.get('/:id', teamsController.getTeamById);

export default teamsRouter;
