import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {ENV} from '~/config/environment.js'
import UserModel from '~/models/userModel.js'

const checkAuthorization = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        try {
            const decoded = jwt.verify(token, ENV.JWT_SECRET);
            req.user = decoded; 
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token', error });
        }
    } catch (error) {
        next(error)
    }
    
};

const checkAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } catch (error) {
        next(error)
    }
};

const login = async (req, res , next) => {
    try {
        const { email, password } = req.body;
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Tạo token JWT
        const token = jwt.sign({ id: user._id , email: user.email , name : user.name , role: user.role }, ENV.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};

const register = async (req, res , next) => {
    try {
        const { email, password , name } = req.body;
        // Kiểm tra nếu người dùng đã tồn tại
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Tài khoản đã tồn tại' });
        }
        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        // Tạo người dùng mới (mặc định role là 'user')
        const newUser = new UserModel({ email, password: hashedPassword, name , role: 'user' });
        await newUser.save();
        res.status(201).json({ status: 'success', message: 'User registered successfully' });
    } catch (error) {
        next(error)
    }
};

const getProfile = async (req, res , next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        try {
            const decoded = jwt.verify(token, ENV.JWT_SECRET);

            delete decoded.iat
            delete decoded.exp
            delete decoded.id
            delete decoded.role
            
            res.status(200).json({ user: decoded }); // Trả về thông tin người dùng
        } catch (error) {
            res.status(401).json({ message: 'Invalid token', error });
        }
    } catch (error) {
        next(error)
    }
}


export const AuthController = {
    checkAuthorization,
    checkAdmin,
    login,
    register,
    getProfile
}