import express from 'express';

import { AuthController } from '~/controllers/authController.js';
import UserRouter from '~/routes/v1/userRouter.js';
import AuthRouter from '~/routes/v1/authRoute.js';
import CategoryRouter from '~/routes/v1/categoryRouter.js';
import ActorRouter from '~/routes/v1/actorRouter.js';
import MovieRouter from '~/routes/v1/movieRouter'

const Router = express.Router();

Router.use('/users', AuthController.checkAuthorization, AuthController.checkAdmin, UserRouter);
Router.use('/auth', AuthRouter);
Router.use('/categories', CategoryRouter);
Router.use('/movies' , MovieRouter)
Router.use('/actors', ActorRouter);

export default Router;
