import express from 'express';

import { AuthController } from '~/controllers/authController.js';
import UserRouter from '~/routes/v1/userRouter.js';
import AuthRouter from '~/routes/v1/authRoute.js';
import CategoryRouter from '~/routes/v1/categoryRouter.js';


const Router = express.Router();

Router.use('/users', AuthController.checkAuthorization, AuthController.checkAdmin, UserRouter);
Router.use('/auth', AuthRouter);
Router.use('/categories', CategoryRouter);

export default Router;