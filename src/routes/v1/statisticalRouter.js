import express from 'express'

import { StatisticalController } from '~/controllers/statisticalController';

const StatisticalRouter = express.Router()

StatisticalRouter.route('/').get(StatisticalController.getStatistical)

export default StatisticalRouter