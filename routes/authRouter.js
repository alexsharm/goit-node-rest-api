import express from "express";

import AuthController from "../controllers/authControllers.js";

import authMiddleware from "../middleware/auth.js";

import validateBody from "../helpers/validateBody.js";

import { authUserSchema } from "../schemas/usersSchemas.js";

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

export default authRouter;
