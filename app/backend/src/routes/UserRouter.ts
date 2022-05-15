import * as express from 'express';
import UserController from '../controllers/UserController';
import middleware from '../middlewares/middleware';
import UserService from '../services/UserService';

const userRouter = express.Router();

const userController = new UserController(new UserService());

userRouter.get(
  '/validate',
  userController.validateLogin,

);

userRouter.post(
  '/',
  middleware.validateEmail,
  middleware.validatePassword,
  userController.getUser,
);
export default userRouter;
