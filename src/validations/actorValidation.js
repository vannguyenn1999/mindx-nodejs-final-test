import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

const actorValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required().strict(),
      age: Joi.number().integer().min(1).max(150).required(),
      info: Joi.string().min(3).max(250).required().strict(),
      gender: Joi.string().valid('Male', 'Female', 'Other').required(),
      country: Joi.string().min(2).max(100).required().strict(),
      // dayOfBirth: Joi.date().less('now')
    });

    if (!req.file) return res.status(400).json({ message: 'Vui lòng upload ảnh đại diện!' });

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

export const ActorValidation = {
  actorValidation,
};
