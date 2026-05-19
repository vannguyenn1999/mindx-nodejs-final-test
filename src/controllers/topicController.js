import { StatusCodes } from 'http-status-codes';

import { slugify, randomStringSecure } from '~/utils/formartter';
import TopicModel from '~/models/topicModel';
import ApiError from '~/utils/ApiError';

const createTopic = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newTopic = new TopicModel({
      name,
      slug: `${slugify(name)}-${randomStringSecure()}`,
    });
    await newTopic.save();
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Thêm mới danh mục thành công !',
      data: newTopic,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTopics = async (req, res, next) => {
  try {
    const search = req.query.search || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const slug = slugify(search)
    const topics = await TopicModel.find({slug : { $regex: slug, $options: 'i' }}).skip(skip).limit(limit);
    const totalTopics = await TopicModel.countDocuments();
    const totalPages = Math.ceil(totalTopics / limit);

    res.status(200).json({
      success: true,
      data: topics,
      pagination: {
        currentPage: page,
        totalPages,
        totalTopics,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTopicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const topic = await TopicModel.findById(id);
    if (!topic) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục không tồn tại !');
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

const updateTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedTopic = await TopicModel.findByIdAndUpdate(
      id,
      { name, slug: `${slugify(name)}-${randomStringSecure()}` },
      { returnDocument: 'after', runValidators: true },
    );
    if (!updatedTopic) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục không tồn tại !');
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Cập nhật danh mục thành công !',
      data: updatedTopic,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTopic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTopic = await TopicModel.findByIdAndDelete(id);
    if (!deletedTopic) {
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

export const TopicController = {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
};
