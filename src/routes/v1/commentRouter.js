import express from 'express';

import CommentController from '~/controllers/commentController.js';
import { AuthMiddlewares } from '~/middlewares/auth.js';

const CommentRouter = express.Router();

const userAuth = [AuthMiddlewares.checkAuthorization];

// GET - Lấy comment theo movieId (không cần auth)
CommentRouter.route('/movie')
  

// POST - Thêm comment mới (cần auth)
CommentRouter.route('/')
.get(CommentController.getCommentByIdMovie)
  .post(...userAuth, CommentController.createComment);

// PUT - Sửa comment (cần auth)
CommentRouter.route('/:commentId')
  .put(...userAuth, CommentController.updateComment)
  .delete(...userAuth, CommentController.deleteComment);

export default CommentRouter;
