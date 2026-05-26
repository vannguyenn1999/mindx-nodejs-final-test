import {StatusCodes} from "http-status-codes"
import mongoose from 'mongoose';

import ApiError from '~/utils/ApiError'
import { slugify, randomStringSecure } from '~/utils/formartter';
import { cloudinary } from '~/config/cloudinary.js';
import MovieModel from "~/models/movieModel"
import CategoryModel from "~/models/categoryModel"
import TopicModel from "~/models/topicModel"

const getAllMovies = async (req , res , next) => {
  try {
    const search = req.query.search || ""
    const categoryId = req.query.category || ""
    const topicId = req.query.topic || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Search by title/slug
    if (search !== "") {
      const slug = slugify(search)
      filter.slug = { $regex: slug, $options: 'i' };
    }
    
    // Filter by category
    if (categoryId !== "") {
      // Check if categoryId is a valid MongoDB ObjectId or slug
      if (mongoose.Types.ObjectId.isValid(categoryId)) {
        filter.categories = new mongoose.Types.ObjectId(categoryId);
      } else {
        // If not a valid ObjectId, try to find category by slug
        const category = await CategoryModel.findOne({ slug: categoryId });
        if (category) {
          filter.categories = category._id;
        }
      }
    }
    
    // Filter by topic
    if (topicId !== "") {
      // Check if topicId is a valid MongoDB ObjectId or slug
      if (mongoose.Types.ObjectId.isValid(topicId)) {
        filter.topics = new mongoose.Types.ObjectId(topicId);
      } else {
        // If not a valid ObjectId, try to find topic by slug
        const topic = await TopicModel.findOne({ slug: topicId });
        if (topic) {
          filter.topics = topic._id;
        }
      }
    }
    
    const totalMovies = await MovieModel.countDocuments(filter);
    const movies = await MovieModel.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).populate('actors' , 'name image slug').populate('categories' , 'name slug').populate('topics' , 'name slug');  
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
    const movie = await MovieModel.findById(id).populate('actors' , 'name image slug').populate('categories' , 'name slug').populate('topics' , 'name slug');    
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
    const {title, imdbRating , duration , info  , actors , country ,link , categories , releaseDate , topics} = req.body;
    // Chuẩn bị dữ liệu để validate
    const bodyData = {
      title: title,
      info: info,
      imdbRating : imdbRating ,
      duration :duration,
      link: link,
      country: country,
      releaseDate : releaseDate,
      image: req.files['image'] ? req.files['image'][0].path : null,
      image_thumb : req.files['image_thumb'] ? req.files['image_thumb'][0].path : null,
      imagePublicId: req.files['image'] ? req.files['image'][0].filename : null,
      imageThumbPublicId : req.files['image_thumb'] ? req.files['image_thumb'][0].filename : null,
      slug: `${slugify(title)}-${randomStringSecure()}`,
      actors : JSON.parse(actors),
      categories : JSON.parse(categories),
      topics : JSON.parse(topics)
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
    const {title, imdbRating , duration , info  , actors , country ,link , categories , releaseDate , topics } = req.body;
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
      releaseDate : releaseDate,
      
      image: req.files['image'] ? req.files['image'][0].path :  movie.image,
      image_thumb : req.files['image_thumb'] ? req.files['image_thumb'][0].path : movie.image_thumb,
      imagePublicId: req.files['image'] ? req.files['image'][0].filename : movie.imagePublicId,
      imageThumbPublicId : req.files['image_thumb'] ? req.files['image_thumb'][0].filename : movie.imageThumbPublicId,
      slug: `${slugify(title)}-${randomStringSecure()}`,
      actors : JSON.parse(actors),
      categories : JSON.parse(categories),
      topics : JSON.parse(topics)
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