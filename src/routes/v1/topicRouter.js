import express from 'express';
import { CategoryValidation } from '~/validations/categoryValidation.js';
import { TopicController } from '~/controllers/topicController';
import {AuthMiddlewares} from '~/middlewares/auth'


const TopicRouter = express.Router();

// Common middleware for admin operations
const adminAuth = [AuthMiddlewares.checkAuthorization, AuthMiddlewares.checkAdmin];

// GET all categories and POST new category
TopicRouter.route('/')
  .get(TopicController.getAllTopics)
  .post(...adminAuth, CategoryValidation.categoryValidation, TopicController.createTopic);

// GET, PUT, DELETE specific category
TopicRouter.route('/:id')
  .get(TopicController.getTopicById)
  .put(...adminAuth, CategoryValidation.categoryValidation, TopicController.updateTopic)
  .delete(...adminAuth, TopicController.deleteTopic);

export default TopicRouter;
