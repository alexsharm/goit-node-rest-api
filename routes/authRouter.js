import express from "express";

import AuthController from "../controllers/authControllers.js";

import authMiddleware from "../middleware/auth.js";

import validateBody from "../helpers/validateBody.js";

import { authUserSchema } from "../schemas/usersSchemas.js";

import uploadMiddleware from "../middleware/upload.js";

import AvatarController from "../controllers/avatarControllers.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post(
  "/register",
  jsonParser,
  validateBody(authUserSchema),
  AuthController.register
);
authRouter.post(
  "/login",
  jsonParser,
  validateBody(authUserSchema),
  AuthController.login
);
authRouter.post("/logout", authMiddleware, AuthController.logout);

authRouter.get("/current", authMiddleware, AuthController.getCurrentUser);

authRouter.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  AvatarController.uploadAvatar
);

export default authRouter;
