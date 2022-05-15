import * as express from 'express';
import LeaderboardService from '../services/LeaderboardService';
import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardRouter = express.Router();

const leaderboardController = new LeaderboardController(new LeaderboardService());

leaderboardRouter.get('/home', leaderboardController.getLeaderboardHome);

export default leaderboardRouter;
