import { Request, Response, NextFunction } from 'express';
import TeamModel from '../database/models/Team';

export default class Middleware {
  // validações usadas na area de login

  public static validateEmail = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    const primeiraVerificacaoEmail = email.includes('@');

    const segundaVerificacaoEmail = email.includes('.com');

    if (!primeiraVerificacaoEmail || !segundaVerificacaoEmail) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    next();
  };

  public static validatePassword = (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (password.length < 6) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    next();
  };

  // validações usadas na rota de matches

  public static validateMatch = async (req: Request, res: Response, next: NextFunction) => {
    const { homeTeam, awayTeam } = req.body;

    if (Number(homeTeam) === Number(awayTeam)) {
      return res.status(401).json({
        message: 'It is not possible to create a match with two equal teams',
      });
    }

    const teamsAll = await TeamModel.findAll();

    const teamOne = teamsAll.some((team) => team.id === Number(homeTeam));
    const teamTwo = teamsAll.some((team) => team.id === Number(awayTeam));

    if (!teamOne || !teamTwo) {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }

    next();
  };
}
