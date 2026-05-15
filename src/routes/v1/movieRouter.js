import express from "express"

import { MovieValidation } from '~/validations/movieValidation';
import { MovieController } from '~/controllers/movieController';
import { AuthController } from '~/controllers/authController.js';
import { uploadMovieCloud } from '~/config/cloudinary.js';

const MovieRouter = express.Router()

const adminAuth = [AuthController.checkAuthorization, AuthController.checkAdmin];

MovieRouter.route('/')
  .get(MovieController.getAllMovies)
  .post(
    ...adminAuth,
    uploadMovieCloud.fields([
      { name: 'image', maxCount: 1 },
      { name: 'image_thumb', maxCount: 1 }
    ]),
    // MovieValidation.movieValidation,
    MovieController.createMovie,
  );

MovieRouter.route('/:id')
  .get(MovieController.getMovieById)
  .put(...adminAuth, uploadMovieCloud.fields([
      { name: 'image', maxCount: 1 },
      { name: 'image_thumb', maxCount: 1 }
    ]), MovieController.updateMovie)
  .delete(...adminAuth, MovieController.deleteMovie);



export default MovieRouter