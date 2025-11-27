import express from 'express'
import { loginUser, registerUser } from '../controller/userController.js';

export const UserRouter = express.Router();

UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);