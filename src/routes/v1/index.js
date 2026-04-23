import express from 'express';

import UserRouter from '~/routes/v1/userRouter.js';
import AuthRouter from '~/routes/v1/authRoute.js';

const Router = express.Router();

Router.use('/users', UserRouter);
Router.use('/auth', AuthRouter);

export default Router;