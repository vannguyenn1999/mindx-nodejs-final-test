
import express from 'express';
import { StatusCodes } from 'http-status-codes';


const UserRouter = express.Router();

UserRouter.get('/', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Hello, World!' });
})


export default UserRouter;