import express from 'express';
import { CategoryValidation } from '~/validations/categoryValidation.js';
import { CategoryController } from '~/controllers/categoryController.js';
// import { AuthController } from '~/controllers/authController.js';
import {AuthMiddlewares} from '~/middlewares/auth'


const CategoryRouter = express.Router();

// Common middleware for admin operations
const adminAuth = [AuthMiddlewares.checkAuthorization, AuthMiddlewares.checkAdmin];

// GET all categories and POST new category
CategoryRouter.route('/')
  .get(CategoryController.getAllCategories)
  .post(...adminAuth, CategoryValidation.categoryValidation, CategoryController.createCategory);

// GET, PUT, DELETE specific category
CategoryRouter.route('/:id')
  .get(CategoryController.getCategoryById)
  .put(...adminAuth, CategoryValidation.categoryValidation, CategoryController.updateCategory)
  .delete(...adminAuth, CategoryController.deleteCategory);

export default CategoryRouter;
