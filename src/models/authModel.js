import Joi from 'joi'
import mongoose from "mongoose";

const LoginSchema = Joi.object({
    email: Joi.string().required().min(3).max(30).trim().strict(),
    password: Joi.string().required().min(6).max(30).trim().strict(),
    name: Joi.string().optional().min(3).max(30).trim().strict()
})

const RegisterSchema = Joi.object({
    email: Joi.string().required().min(3).max(30).trim().strict(),
    password: Joi.string().required().min(6).max(30).trim().strict(),
    passwordConfirm: Joi.string()
        .required()
        .valid(Joi.ref('password')) // Kiểm tra khớp với trường 'password'
        .strict(),
    name: Joi.string().optional().min(3).max(30).trim().strict()
})


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true // Nên thêm để tránh trùng lặp email hoa/thường
  },
  password: {
    type: String,
    required: true
  },
  name : {
    type: String,
    required: false
  }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema)

export const AuthModel = {
    LoginSchema,
    RegisterSchema
}

export default UserModel