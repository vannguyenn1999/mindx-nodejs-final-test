import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

const movieValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().min(2).max(50).required().strict(),
      link: Joi.string().min(3).max(250).required().strict(),
      info: Joi.string().min(3).max(250).required().strict(),
      // imdbRating : Joi.number().min(1).max(10).required().strict()
      
    });
    // if (!req.file) return res.status(400).json({ message: 'Vui lòng upload ảnh đại diện!' });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const MovieValidation = {
  movieValidation,
};
