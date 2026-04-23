
import express from 'express';
import { AuthValidate } from '~/validations/authValidation';
import { AuthController } from '~/controllers/authController';

const AuthRouter = express.Router();

AuthRouter.post('/login', AuthValidate.login, AuthController.login);
AuthRouter.post('/register', AuthValidate.register, AuthController.register);
AuthRouter.get('/profile', AuthController.getProfile);


export default AuthRouter;