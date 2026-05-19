import express from 'express';

import { UserController } from '~/controllers/userController.js';

const UserRouter = express.Router();

UserRouter.route('/').get(UserController.getAllUsers)
UserRouter.route('/:id').get(UserController.getAllUsers).put( UserController.changeRoleUser)


export default UserRouter;
