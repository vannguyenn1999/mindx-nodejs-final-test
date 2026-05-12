import UserModel from '~/models/userModel.js';

const getAllUsers = async (req, res, next) => {
  try {
    const search = req.query.search || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const users = await UserModel.find({
      $or: [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ]
    }).skip(skip).limit(limit);
    // const users = await UserModel.find({email : { $regex: search, $options: 'i' }}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalUsers = await UserModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      data: users,
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

const changeRoleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (!['role', 'active'].includes(value)) {
      return res.status(400).json({
        success: false,
        message: "Giá trị value phải là 'role' hoặc 'active'.",
      });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại!",
      });
    }

    const update = {};
    if (value === 'role') {
      update.role = user.role === 'user' ? 'admin' : 'user';
    } else {
      update.isActive = !user.isActive;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, update, {
      returnDocument: 'after',
    });

    res.status(200).json({
      success: true,
      message: value === 'role'
        ? 'Cập nhật quyền người dùng thành công!'
        : 'Cập nhật trạng thái kích hoạt người dùng thành công!',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  getAllUsers,
  changeRoleUser
};