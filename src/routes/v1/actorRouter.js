import express from 'express';

import { ActorValidation } from '~/validations/actorValidation.js';
import { ActorController } from '~/controllers/actorController.js';
import { AuthController } from '~/controllers/authController.js';
import { uploadCloud } from '~/config/cloudinary.js';

const ActorRouter = express.Router();

const adminAuth = [AuthController.checkAuthorization, AuthController.checkAdmin];

ActorRouter.route('/')
  .get(ActorController.getAllActors)
  .post(
    ...adminAuth,
    uploadCloud.single('image'),
    ActorValidation.actorValidation,
    ActorController.createActor,
  );

export default ActorRouter;
