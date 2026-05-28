import SettingModel from "~/models/settingModel"

const getAllBackground = async (req, res , next) => {
  try {
    const backgrounds = await SettingModel.find({ key: 'background' }).populate({
      path: 'movies',
      select: 'title image slug info image_thumb categories topics',
      populate: [
        { path: 'categories', select: 'name slug' },
        { path: 'topics', select: 'name slug' }
      ]
    })
    res.status(200).json({
      success: true,
      data: backgrounds,
    });
  } catch (error) {
    next(error);
  }
};

const createBackground = async (req, res , next) => {
  try {
    const { movieId , name } = req.body;
    console.log("movieId" , req.body)
    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Thiếu movieId' });
    }

    if (!name || name.trim() === '' || name !== 'background') {
      return res.status(400).json({ success: false, message: 'Thiếu name' });
    }

    const updatedBackground = await SettingModel.findOneAndUpdate(
      { key: 'background' }, // Điều kiện tìm kiếm
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
      data: updatedBackground
    });

  } catch (error) {
    next(error);
  }
}

const deleteBackground = async (req, res , next) => {
  try {
    const { movieId , name } = req.body;
    console.log(req.body)
    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Thiếu movieId' });
    }

    if (!name || name.trim() === '' || name !== 'background') {
      return res.status(400).json({ success: false, message: 'Thiếu name' });
    }

    // Sử dụng $pull để xóa phần tử cụ thể ra khỏi mảng
    const updatedBackground = await SettingModel.findOneAndUpdate(
      { key: 'background' },
      { 
        $pull: { movies: movieId } // Tìm trong mảng movies và xóa movieId này đi
      },
      { new: true } // Trả về dữ liệu mới nhất sau khi xóa
    ).populate('movies', 'title image');

    if (!updatedBackground) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy cài đặt này ' });
    }

    res.status(200).json({
      success: true,
      message: 'Đã xóa phim khỏi lịch sử xem',
      data: updatedBackground
    });
  } catch (error) {
    next(error)
  }
}

export const SettingController = {
    getAllBackground,
    createBackground,
    deleteBackground
}