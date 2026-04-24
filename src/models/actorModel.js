import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    info: {
        type: String,
        required: false,
        trim: true
    },
    slug : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    image : {
        type: String,
        required: false,
        trim: true
    },
    gender : {
        type: String,
        enum: ['male', 'female', 'other'],
        required: false
    },
    country : {
        type: String,
        required: false,
        trim: true
    },
    dayOfBirth : {
        type: Date,
        required: false
    }

}, { timestamps: true });

const ActorModel = mongoose.model('Actor', actorSchema)
export default ActorModel
