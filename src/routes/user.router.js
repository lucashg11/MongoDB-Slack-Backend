import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";

const userRouter = Router();

userRouter.get('/me', authMiddleware, userController.getMe);
userRouter.patch('/profile', authMiddleware, userController.updateProfile);

export default userRouter;
