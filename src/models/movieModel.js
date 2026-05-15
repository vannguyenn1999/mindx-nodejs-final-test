import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imagePublicId: {
      type: String,
      required: false,
      trim: true,
    },
    imageThumbPublicId: {
      type: String,
      required: false,
      trim: true,
    },
    imdbRating: {
      type: Number,
      required: false,
      default: 5.0,
    },
    duration: {
      type: String,
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

    image_thumb: {
      type: String,
      required: false,
      trim: true,
    },

    info: {
      type: String,
      required: false,
      trim: true,
    },

    releaseDate: {
      type: Date,
      required: false,
    },
    actors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
      },
    ],

    country: {
      type: String,
      required: false,
      trim: true,
    },
    link: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true },
);

const MovieModel = mongoose.model('Movie', movieSchema);
export default MovieModel;
