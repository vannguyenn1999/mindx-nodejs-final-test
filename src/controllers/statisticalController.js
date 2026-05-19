import { StatusCodes } from 'http-status-codes';

import ActorModel from '~/models/actorModel';
import CategoryModel from '~/models/categoryModel';
import MovieModel from "~/models/movieModel"
import UserModel from '~/models/userModel';


const getStatistical =  async (req , res , next) => {
    try {
        const totalCategories = await CategoryModel.countDocuments();
        const totalMovies = await MovieModel.countDocuments();
        const totaActors = await ActorModel.countDocuments();
        const totalUsers = await UserModel.countDocuments();

        const dataStatistical = {
            category : totalCategories,
            movie : totalMovies,
            actor : totaActors,
            user : totalUsers

        }

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Số liệu thống kê !',
            data: dataStatistical,
        });
    } catch (error) {
        error(next)
    }
}

export const StatisticalController = {
    getStatistical
}