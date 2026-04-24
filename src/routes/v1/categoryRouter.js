import express from 'express';
import { CategoryValidation } from '~/validations/categoryValidation.js';
import { CategoryController } from '~/controllers/categoryController.js';
import { AuthController } from '~/controllers/authController.js';

const CategoryRouter = express.Router();

// Common middleware for admin operations
const adminAuth = [
    AuthController.checkAuthorization,
    AuthController.checkAdmin
];

// GET all categories and POST new category
CategoryRouter.route('/')
    .get(CategoryController.getAllCategories)
    .post(
        ...adminAuth,
        CategoryValidation.categoryValidation,
        CategoryController.createCategory
    );

// GET, PUT, DELETE specific category
CategoryRouter.route('/:slug')
    .get(CategoryController.getCategoryById)
    .put(
        ...adminAuth,
        CategoryValidation.categoryValidation,
        CategoryController.updateCategory
    )
    .delete(
        ...adminAuth,
        CategoryController.deleteCategory
    );

export default CategoryRouter;