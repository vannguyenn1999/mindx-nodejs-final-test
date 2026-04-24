import mongoose from "mongoose";

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
  },
  role :{
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema)

export default UserModel