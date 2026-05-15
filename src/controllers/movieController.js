import {StatusCodes} from "http-status-codes"

import ApiError from '~/utils/ApiError'
import { slugify, randomStringSecure } from '~/utils/formartter';
import { cloudinary } from '~/config/cloudinary.js';
import MovieModel from "~/models/movieModel"

const getAllMovies = async (req , res , next) => {
  try {
    const search = req.query.search || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const slug = slugify(search)
    const movies = await MovieModel.find({slug : { $regex: slug, $options: 'i' }}).sort({ updatedAt: -1 }).skip(skip).limit(limit).populate('actors' , 'name image');  
    const totalMovies = await MovieModel.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);
    res.status(200).json({
      success: true,
      data: movies,
      pagination: {
        currentPage: page,
        totalPages,
        totalMovies,
        limit,
      },
    });
  } catch (error) {
    next(error)
  }
}

const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await MovieModel.findById(id).populate('actors' , 'name image');    
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại !');
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const {title, imdbRating , duration , info  , actors , country ,link } = req.body;
    // Chuẩn bị dữ liệu để validate
    const bodyData = {
      title: title,
      info: info,
      imdbRating : imdbRating ,
      duration :duration,
      link: link,
      country: country,
      image: req.files['image'] ? req.files['image'][0].path : null,
      image_thumb : req.files['image_thumb'] ? req.files['image_thumb'][0].path : null,
      imagePublicId: req.files['image'] ? req.files['image'][0].filename : null,
      imageThumbPublicId : req.files['image_thumb'] ? req.files['image_thumb'][0].filename : null,
      slug: `${slugify(title)}-${randomStringSecure()}`,
      actors : JSON.parse(actors)
    };

    // Lưu vào MongoDB
    const newMovie = await MovieModel.create(bodyData);

    res.status(201).json({
      message: 'Tạo phim thành công!',
      data: newMovie,
    });
  } catch (err) {
    next(err);
  }
};

const deleteMovie = async (req ,res , next) => {
  try {
    const { id } = req.params;
    const deletedActor = await MovieModel.findByIdAndDelete(id);
    if (!deletedActor) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Diễn viên không tồn tại !');
    }

    if (deletedActor.imagePublicId) {
      cloudinary.uploader.destroy(deletedActor.imagePublicId, (error, result) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('Result:', result);
        }
      });
    }

    if (deletedActor.imageThumbPublicId) {
      cloudinary.uploader.destroy(deletedActor.imageThumbPublicId, (error, result) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('Result:', result);
        }
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Xóa phim thành công !',
    });
  } catch (error) {
    next(error);
  }
}

const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params
    const {title, imdbRating , duration , info  , actors , country ,link } = req.body;
    const movie = await MovieModel.findById(id).select('imageThumbPublicId').select('image_thumb').select('imagePublicId').select('image');
    if (!movie) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Phim không tồn tại !');
    }
    const dataUpdate = {
      title: title,
      info: info,
      imdbRating : imdbRating ,
      duration :duration,
      link: link,
      country: country,
      
      image: req.files['image'] ? req.files['image'][0].path :  movie.image,
      image_thumb : req.files['image_thumb'] ? req.files['image_thumb'][0].path : movie.image_thumb,
      imagePublicId: req.files['image'] ? req.files['image'][0].filename : movie.imagePublicId,
      imageThumbPublicId : req.files['image_thumb'] ? req.files['image_thumb'][0].filename : movie.imageThumbPublicId,
      slug: `${slugify(title)}-${randomStringSecure()}`,
      actors : JSON.parse(actors)
    }
    console.log("req.files['image_thumb']" , req.files['image_thumb'])
    if (req.files['image_thumb']) {
      cloudinary.uploader.destroy(movie.imageThumbPublicId, (error, result) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('Result:', result);
        }
      });
    }

    if(req.files['image']){
      cloudinary.uploader.destroy(movie.imagePublicId, (error, result) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('Result:', result);
        }
      });
    }

    const updatedMovie = await MovieModel.findByIdAndUpdate(
      id,
      dataUpdate,
      { returnDocument: 'after', runValidators: true },
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Cập nhật phim thành công !',
      data: updatedMovie,
    });
  } catch (error) {
    next(error);
  }
};

export const MovieController = {
    getAllMovies,
    deleteMovie,
    createMovie,
    getMovieById,
    updateMovie
}