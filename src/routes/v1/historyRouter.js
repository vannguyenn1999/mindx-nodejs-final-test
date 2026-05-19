import express from 'express'

import { HistoryController } from '~/controllers/historyController';

const HistoryRouter =  express.Router()

HistoryRouter.route('/').get( HistoryController.getAllHistory).post(HistoryController.createMovieHistory).delete( HistoryController.deleteMovieHistory)

export default HistoryRouter