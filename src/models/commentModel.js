import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
   
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },

   
    comment: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000, 
    },
    
    isApproved: {
      type: Boolean,
      default: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ]
  },
  { 
    timestamps: true 
  },
);

commentSchema.index({ movie: 1, createdAt: -1 });

const CommentModel = mongoose.model('Comment', commentSchema);

export default CommentModel;