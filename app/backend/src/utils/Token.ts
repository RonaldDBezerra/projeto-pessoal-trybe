import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import IUser from '../Interface/User';

const KEY = fs.readFileSync('jwt.evaluation.key', { encoding: 'utf-8' });

const generateToken = (data: IUser) =>
  jwt.sign({ ...data }, KEY, { expiresIn: '7d', algorithm: 'HS256' });

const validateToken = (token: string) => jwt.verify(token, KEY);

export { generateToken, validateToken };
