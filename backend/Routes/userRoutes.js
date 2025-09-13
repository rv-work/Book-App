import express from 'express';
import { checkAuth,  login,  signup } from '../Controllers/userController.js';

const userRouter = express.Router();


userRouter.post('/signup' , signup);
userRouter.post('/login', login);
userRouter.get('/check', checkAuth);


export default userRouter;
