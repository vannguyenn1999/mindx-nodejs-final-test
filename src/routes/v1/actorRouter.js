import express from 'express';

import { ActorValidation } from '~/validations/actorValidation.js';
import { ActorController } from '~/controllers/actorController.js';
// import { AuthController } from '~/controllers/authController.js';
import {AuthMiddlewares} from '~/middlewares/auth'
import { uploadActorCloud } from '~/config/cloudinary.js';

const ActorRouter = express.Router();

const adminAuth = [AuthMiddlewares.checkAuthorization, AuthMiddlewares.checkAdmin];

ActorRouter.route('/')
  .get(ActorController.getAllActors)
  .post(
    ...adminAuth,
    uploadActorCloud.single('image'),
    ActorValidation.actorValidation,
    ActorController.createActor,
  );

ActorRouter.route('/:id')
  .get(ActorController.getActorById)
  .put(...adminAuth, uploadActorCloud.single('image'), ActorValidation.actorValidation, ActorController.updateActor)
  .delete(...adminAuth, ActorController.deleteActor);

export default ActorRouter;
