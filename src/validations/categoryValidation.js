import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

const categoryValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required().min(3).max(30).trim().strict(),
    });
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

export const CategoryValidation = {
  categoryValidation,
};
