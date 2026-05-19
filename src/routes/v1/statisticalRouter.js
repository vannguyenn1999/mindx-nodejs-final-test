import express from 'express'

import { StatisticalController } from '~/controllers/statisticalController';
import { AuthController } from '~/controllers/authController.js';
const StatisticalRouter = express.Router()


const adminAuth = [AuthController.checkAuthorization, AuthController.checkAdmin];

StatisticalRouter.route('/').get(adminAuth , StatisticalController.getStatistical)


export default StatisticalRouter