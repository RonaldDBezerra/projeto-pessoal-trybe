// import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { generateToken, validateToken } from '../utils/Token';
import UserModel from '../database/models/User';
import IUser from '../Interface/User';

export default class UserService {
  constructor(private userModel = UserModel) {}

  getUser = async (userInfo: IUser) => {
    const retornoData = await this.userModel.findOne({ where: { email: userInfo.email } });

    if (userInfo.password && retornoData?.password) {
      const validadePass = bcrypt.compareSync(userInfo.password, retornoData.password);

      if (!validadePass) return null;

      const usuario: IUser = {
        id: retornoData.id,
        username: retornoData.username,
        role: retornoData.role,
        email: retornoData.email,
      };

      const token = generateToken(usuario);

      return ({ user: usuario, token }
      );
    }
    return null;
  };

  validadeLogin = (token: string) => {
    try {
      const data = validateToken(token);

      return data as IUser;
    } catch (error) {
      return null;
    }
  };
}
