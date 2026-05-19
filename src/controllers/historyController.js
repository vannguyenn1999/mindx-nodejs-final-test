import HistoryModel from "~/models/historyModel";

import { slugify, randomStringSecure } from '~/utils/formartter';

const getAllHistory = async (req, res, next) => {
  try {
    const userId = req.user.id    

    const search = req.query.search || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const slug = slugify(search)
    const history = await HistoryModel.find({user : userId , slug : { $regex: slug, $options: 'i' }}).skip(skip).limit(limit).populate('movies', 'title image slug');
    const totalHistories = await HistoryModel.countDocuments();
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
        { new: true } // Trả về dữ liệu mới nhất sau khi xóa
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