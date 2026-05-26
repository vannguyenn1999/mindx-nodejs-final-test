import express from "express";

import {AuthMiddlewares} from '~/middlewares/auth'
import {SettingController} from '~/controllers/settingController'


const SettingRouter = express.Router();
const adminAuth = [AuthMiddlewares.checkAuthorization, AuthMiddlewares.checkAdmin];


SettingRouter.route('/background').get(SettingController.getAllBackground).post(...adminAuth, SettingController.createBackground).delete(...adminAuth, SettingController.deleteBackground);

export default SettingRouter