import * as express from 'express';
import MatchesService from '../services/MatchesService';
import MatchesController from '../controllers/MatchesController';
import middleware from '../middlewares/middleware';

const matchesRouter = express.Router();

const matchesController = new MatchesController(new MatchesService());

matchesRouter.get('/', matchesController.getMatches);

matchesRouter.post(
  '/',
  middleware.validateMatch,
  matchesController.addMatches,
);

matchesRouter.patch('/:id/finish', matchesController.matchFinished);

matchesRouter.patch('/:id', matchesController.updateMatch);

export default matchesRouter;
