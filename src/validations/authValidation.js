import {StatusCodes} from 'http-status-codes'

import {AuthModel} from '~/models/authModel'

const login = (req, res, next) => {
    try {
        const { error } = AuthModel.LoginSchema.validate(req.body , { abortEarly: false }) // abortEarly: false để hiển thị tất cả lỗi thay vì dừng lại ở lỗi đầu tiên
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: 'FAILED' , message: 'Tài khoản hoặc mật khẩu không đúng !' })
        }
        next()
    } catch (error) {next(error)}
}


const register = (req, res, next) => {
    try {
        const { error } = AuthModel.RegisterSchema.validate(req.body , { abortEarly: false })
        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: 'FAILED' , message: 'Thông tin đăng ký không hợp lệ' })
        }
        next()
    } catch (error) {next(error)}
}

export const AuthValidate = {
    login,
    register
}