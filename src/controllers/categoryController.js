import { StatusCodes } from 'http-status-codes';
import { slugify, randomStringSecure } from '~/utils/formartter';
import CategoryModel from '~/models/categoryModel';
import ApiError from '~/utils/ApiError';

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = new CategoryModel({
      name,
      slug: `${slugify(name)}-${randomStringSecure()}`,
    });
    await newCategory.save();
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Thêm mới danh mục thành công !',
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const search = req.query.search || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find({name : { $regex: search, $options: 'i' }}).skip(skip).limit(limit);
    const totalCategories = await CategoryModel.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        currentPage: page,
        totalPages,
        totalCategories,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await CategoryModel.findOne({ slug });
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục không tồn tại !');
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;
    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { slug },
      { name, slug: `${slugify(name)}-${randomStringSecure()}` },
      { returnDocument: 'after', runValidators: true },
    );
    if (!updatedCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục không tồn tại !');
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Cập nhật danh mục thành công !',
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục không tồn tại !');
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Xóa danh mục thành công !',
    });
  } catch (error) {
    next(error);
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
