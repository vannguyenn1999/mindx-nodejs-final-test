import CommentModel from "~/models/commentModel"
import MovieModel from "~/models/movieModel"

const getCommentByIdMovie = async (req , res , next) => {
    try {
        const slug = req.query.slug
        if(!slug){
            return res.status(400).json({
                success : false,
                message : 'Thiếu slug!'
            })
        }

        // Tìm movie theo slug
        const movie = await MovieModel.findOne({slug: slug})
        if(!movie){
            return res.status(404).json({
                success : false,
                message : 'Movie không tồn tại!'
            })
        }

        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * 10;
        
        const comments = await CommentModel.find({movie: movie._id})
            .populate('user', 'name image email')
            // .populate('movie', 'title')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(10);
        
        const total = await CommentModel.countDocuments({movie: movie._id});
        
        res.status(200).json({
            success: true,
            data: comments,
            pagination: {
                currentPage: page,
                pageSize: 10,
                total: total,
                totalPages: Math.ceil(total / 10)
            },
        });
    } catch (error) {
        next(error)
    }
}

const createComment = async (req, res, next) => {
    try {
        const { slug, comment } = req.body;
        const userId = req.user._id || req.user.id;
        console.log("slug" , slug , "comment" , comment)
        if (!comment || !slug) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu slug hoặc comment!'
            });
        }

        const movie = await MovieModel.findOne({slug: slug})
        if(!movie){
            return res.status(404).json({
                success : false,
                message : 'Movie không tồn tại!'
            })
        }

    
        if (comment.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Comment không được để trống!'
            });
        }

        const newComment = new CommentModel({
            user: userId,
            movie: movie._id,
            comment: comment.trim()
        });

        await newComment.save();
        await newComment.populate('user', 'name email');

        res.status(201).json({
            success: true,
            message: 'Thêm comment thành công!',
            data: newComment
        });
    } catch (error) {
        next(error);
    }
};

const updateComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;
        const userId = req.user._id || req.user.id;

        if (!commentId || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu commentId hoặc comment!'
            });
        }

        if (comment.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Comment không được để trống!'
            });
        }

        const existingComment = await CommentModel.findById(commentId);

        if (!existingComment) {
            return res.status(404).json({
                success: false,
                message: 'Comment không tồn tại!'
            });
        }

        if (existingComment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền sửa comment này!'
            });
        }

        existingComment.comment = comment.trim();
        await existingComment.save();
        await existingComment.populate('user', 'name email');

        res.status(200).json({
            success: true,
            message: 'Sửa comment thành công!',
            data: existingComment
        });
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id || req.user.id;
        const userRole = req.user.role;

        if (!commentId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu commentId!'
            });
        }

        const existingComment = await CommentModel.findById(commentId);

        if (!existingComment) {
            return res.status(404).json({
                success: false,
                message: 'Comment không tồn tại!'
            });
        }

        // Chỉ cho phép xoá comment của chính mình hoặc admin
        if (existingComment.user.toString() !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xoá comment này!'
            });
        }

        await CommentModel.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: 'Xoá comment thành công!'
        });
    } catch (error) {
        next(error);
    }
};

const CommentController = {
    getCommentByIdMovie,
    createComment,
    updateComment,
    deleteComment
}

export default CommentController;