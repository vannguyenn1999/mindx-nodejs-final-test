import { slugify, randomStringSecure } from '~/utils/formartter';
import ActorModel from '~/models/actorModel.js';


const getAllActors = async (req, res, next) => {
  try {
    const search = req.query.search || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const actors = await ActorModel.find({name : { $regex: search, $options: 'i' }}).skip(skip).limit(limit);  
    const totalUsers = await UserModel.countDocuments();
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

const createActor = async (req, res, next) => {
  try {
    const { name, age, gender, country, dayOfBirth } = req.body;

    // Chuẩn bị dữ liệu để validate
    const bodyData = {
      name: name,
      age: Number(age),
      gender: gender,
      country: country,
      dayOfBirth: dayOfBirth ? new Date(dayOfBirth) : null,
      image: req.file ? req.file.path : null,
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

export const ActorController = {
  getAllActors,
  createActor,
};
