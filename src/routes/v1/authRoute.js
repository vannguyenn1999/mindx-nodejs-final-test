import express from 'express';
import { VALIDATIONS } from '~/validations/Validation';
import { AuthController } from '~/controllers/authController';

const UserRouter = express.Router();

UserRouter.post('/login', VALIDATIONS.login, AuthController.login);
UserRouter.post('/register', VALIDATIONS.register, AuthController.register);
UserRouter.get('/profile', AuthController.getProfile);
UserRouter.post('/refresh-token', AuthController.refreshToken);

export default UserRouter;
