import express from 'express';

import { UserController } from '~/controllers/userController.js';
import { AuthController } from '~/controllers/authController.js';

const UserRouter = express.Router();

const adminAuth = [AuthController.checkAuthorization, AuthController.checkAdmin];

UserRouter.route('/').get(adminAuth , UserController.getAllUsers)
UserRouter.route('/:id').get(adminAuth , UserController.getAllUsers).put(adminAuth , UserController.changeRoleUser)


export default UserRouter;
