import express from 'express';

import {AuthMiddlewares} from '~/middlewares/auth'

import UserRouter from '~/routes/v1/userRouter.js';
import AuthRouter from '~/routes/v1/authRoute.js';
import CategoryRouter from '~/routes/v1/categoryRouter.js';
import TopicRouter from '~/routes/v1/topicRouter';
import ActorRouter from '~/routes/v1/actorRouter.js';
import MovieRouter from '~/routes/v1/movieRouter'
import StatisticalRouter from '~/routes/v1/statisticalRouter'
import HistoryRouter from '~/routes/v1/historyRouter'
import SettingRouter from '~/routes/v1/settingRouter';
import CommentRouter from '~/routes/v1/commentRouter.js';

const Router = express.Router();

Router.use('/users', AuthMiddlewares.checkAuthorization, AuthMiddlewares.checkAdmin, UserRouter);
Router.use('/statisticals',AuthMiddlewares.checkAuthorization, AuthMiddlewares.checkAdmin, StatisticalRouter);

Router.use('/histories', AuthMiddlewares.checkAuthorization , HistoryRouter)

Router.use('/settings', SettingRouter);
Router.use('/auth', AuthRouter); 
Router.use('/categories', CategoryRouter);
Router.use('/topics', TopicRouter);
Router.use('/movies' , MovieRouter)
Router.use('/actors', ActorRouter);
Router.use('/comments', CommentRouter);


export default Router;
