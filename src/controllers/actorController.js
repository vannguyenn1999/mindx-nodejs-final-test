import {StatusCodes} from "http-status-codes"

import ApiError from '~/utils/ApiError'
import { slugify, randomStringSecure } from '~/utils/formartter';
import { cloudinary } from '~/config/cloudinary.js';
import ActorModel from '~/models/actorModel.js';
import MovieModel from '~/models/movieModel.js';

const getAllActors = async (req, res, next) => {
  try {
    const search = req.query.search || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const slug = slugify(search)
    // const actors = await ActorModel.find({slug : { $regex: slug, $options: 'i' }}).skip(skip).limit(limit);  
    const actors = await ActorModel.find({slug : { $regex: slug, $options: 'i' }}).sort({ updatedAt: -1 }).skip(skip).limit(limit).select('-imagePublicId');  
    const totalUsers = await ActorModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({
      success: true,
      data: actors,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};


const getActorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actor = await ActorModel.findById(id).select('-imagePublicId');
    // console.log("actor" , actor)
    
    if (!actor) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Diễn viên không tồn tại !');
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: actor,
    });
  } catch (error) {
    next(error);
  }
};

const getActorBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const actor = await ActorModel.findOne({ slug }).select('-imagePublicId');
    if (!actor) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Diễn viên không tồn tại !');
    }

    const movies = await MovieModel.aggregate([
      { $match: { actors: actor._id } },
      { $sample: { size: 5 } },
      { $project: { title: 1, slug: 1, image: 1 } },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        actor,
        movies,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateActor = async (req, res, next) => {
  try {
    const { id } = req.params
    const {name , info , gender , country } = req.body
    const actor = await ActorModel.findById(id).select('imagePublicId').select('image');
    if (!actor) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Diễn viên không tồn tại !');
    }
    const image= req.file ? req.file.path : actor.image
    const imagePublicId = req.file ? req.file.filename : actor.imagePublicId
    if (actor && req.file) {
      cloudinary.uploader.destroy(actor.imagePublicId, (error, result) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('Result:', result);
        }
      });
    }
    const updatedActor = await ActorModel.findByIdAndUpdate(
      id,
      { name, slug: `${slugify(name)}-${randomStringSecure()}` , imagePublicId , image , info , country , gender},
      { returnDocument: 'after', runValidators: true },
    );
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Cập nhật diễn viên thành công !',
      data: updatedActor,
    });
  } catch (error) {
    next(error);
  }
};

const createActor = async (req, res, next) => {
  try {
    const { name, gender, country, dayOfBirth , info } = req.body;
    // Chuẩn bị dữ liệu để validate
    const bodyData = {
      name: name,
      info : info ,
      gender: gender,
      country: country,
      dayOfBirth: dayOfBirth,
      image: req.file ? req.file.path : null,
      imagePublicId: req.file ? req.file.filename : null,
      slug: `${slugify(name)}-${randomStringSecure()}`,
    };

    // Lưu vào MongoDB
    const newAuthor = await ActorModel.create(bodyData);

    res.status(201).json({
      message: 'Tạo diễn viên thành công!',
      data: newAuthor,
    });
  } catch (err) {
    next(err);
  }
};

const deleteActor = async (req ,res , next) => {
  try {
    const { id } = req.params;
    const deletedActor = await ActorModel.findByIdAndDelete(id);
    if (!deletedActor) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Diễn viên không tồn tại !');
    }

    try {
      if (deletedActor.imagePublicId) {
      cloudinary.uploader.destroy(deletedActor.imagePublicId, (error, result) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('Result:', result);
        }
      });
    }
    } catch (error) {
      console.log("error : " , error)
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Xóa diễn viên thành công !',
    });
  } catch (error) {
    next(error);
  }
}

export const ActorController = {
  getAllActors,
  createActor,
  deleteActor,
  updateActor,
  getActorById,
  getActorBySlug,
};
