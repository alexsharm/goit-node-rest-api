import Joi from "joi";

export const authUserSchema = Joi.object({
  email: Joi.string().required().min(3).max(30),
  password: Joi.string().required().min(6).max(30),
});

export const verificationEmailSchema = Joi.object({
  email: Joi.string().required().min(3).max(30),
});
