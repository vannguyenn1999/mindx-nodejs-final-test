import mongoose from 'mongoose';
const historySchema = new mongoose.Schema(
  {
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    movies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
        },
    ],
  },
  { timestamps: true },
);

const HistoryModel = mongoose.model('History', historySchema);

export default HistoryModel;
