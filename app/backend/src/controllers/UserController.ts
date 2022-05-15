import { Request, Response } from 'express';
import UserService from '../services/UserService';

export default class UserController {
  constructor(private userService: UserService) {}

  getUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const retorno = await this.userService.getUser({ email, password });

    if (!retorno) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    return res.status(200).json(retorno);
  };

  validateLogin = (req: Request, res: Response) => {
    const token = req.headers.authorization || '';

    const data = this.userService.validadeLogin(token);

    if (!data) return res.status(401).json({ error: 'Token invalid' });

    return res.status(200).json(data.role);
  };
}
