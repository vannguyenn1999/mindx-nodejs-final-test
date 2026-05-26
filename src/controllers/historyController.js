import HistoryModel from "~/models/historyModel";
import mongoose from 'mongoose';

import { slugify } from '~/utils/formartter';

const getAllHistory = async (req, res, next) => {
  try {
    const userId = req.user.id    

    const search = req.query.search || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build search query for movies by title
    const searchQuery = search ? { $regex: search, $options: 'i' } : { $ne: null }
    // Use aggregation pipeline to search by movie title
    const history = await HistoryModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: 'movies', localField: 'movies', foreignField: '_id', as: 'movies' } },
      { $unwind: { path: '$movies', preserveNullAndEmptyArrays: true } },
      { $match: { 'movies.title': searchQuery } },
      { $group: {
          _id: '$_id',
          user: { $first: '$user' },
          movies: { $push: '$movies' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);
    
    // Count total filtered histories
    const countResult = await HistoryModel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: 'movies', localField: 'movies', foreignField: '_id', as: 'movies' } },
      { $unwind: { path: '$movies', preserveNullAndEmptyArrays: true } },
      { $match: { 'movies.title': searchQuery } },
      { $group: { _id: '$_id' } },
      { $count: 'total' }
    ]);
    
    const totalHistories = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalHistories / limit);

    res.status(200).json({
      success: true,
      data: history,
      pagination: {
        currentPage: page,
        totalPages,
        totalHistories,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createMovieHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Thiếu movieId' });
    }

    const updatedHistory = await HistoryModel.findOneAndUpdate(
      { user: userId }, // Điều kiện tìm kiếm
      { 
        // Dùng $addToSet để tránh trùng phim, nếu muốn cho phép trùng thì đổi thành $push
        $addToSet: { movies: movieId } 
      },
      { 
        upsert: true, // Nếu chưa có lịch sử cho user này -> tự động tạo mới
        new: true,    // Trả về dữ liệu sau khi đã cập nhật
        setDefaultsOnInsert: true 
      }
      ).populate('movies', 'title image slug'); // Thêm populate nếu muốn lấy luôn thông tin phim vừa thêm

      // 3. Trả về kết quả
      res.status(200).json({
        success: true,
        message: 'Đã thêm phim vào lịch sử xem',
        data: updatedHistory
      });
  } catch (error) {
    next(error);
  }
};

const deleteMovieHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id; 
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Thiếu movieId' });
    }

    // Sử dụng $pull để xóa phần tử cụ thể ra khỏi mảng
    const updatedHistory = await HistoryModel.findOneAndUpdate(
      { user: userId },
      { 
          $pull: { movies: movieId } // Tìm trong mảng movies và xóa movieId này đi
      },
      { returnDocument: 'after', runValidators: true }, 
    ).populate('movies', 'title image');

    if (!updatedHistory) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch sử của người dùng này' });
    }

    res.status(200).json({
      success: true,
      message: 'Đã xóa phim khỏi lịch sử xem',
      data: updatedHistory
    });

  } catch (error) {
    next(error);
  }
};

export const HistoryController = {
    getAllHistory,
    deleteMovieHistory,
    createMovieHistory
}