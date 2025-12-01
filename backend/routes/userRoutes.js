import express from 'express'
import { getUserData, loginUser, registerUser, updateUserProfile } from '../controller/userController.js';

export const UserRouter = express.Router();

UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);
UserRouter.post('/getuser', getUserData);
UserRouter.put('/updateprofile', updateUserProfile);