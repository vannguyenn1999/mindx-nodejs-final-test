import mongoose from 'mongoose';

const actorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    info: {
      type: String,
      required: false,
      trim: true,
    },
    age: {
      type: Number,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    imagePublicId: {
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: false,
    },
    country: {
      type: String,
      required: false,
      trim: true,
    },
    dayOfBirth: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const ActorModel = mongoose.model('Actor', actorSchema);
export default ActorModel;
