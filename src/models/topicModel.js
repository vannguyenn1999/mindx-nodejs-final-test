import mongoose from 'mongoose';
const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const TopicModel = mongoose.model('Topic', topicSchema);

export default TopicModel;
