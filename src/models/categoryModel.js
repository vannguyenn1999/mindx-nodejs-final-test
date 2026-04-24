import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    }
}, { timestamps: true });

const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;