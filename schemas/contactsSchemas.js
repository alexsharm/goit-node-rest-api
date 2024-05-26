import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(2).max(30),
  email: Joi.string().required(),
  phone: Joi.string().required().min(3).max(21),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string(),
  phone: Joi.string().min(3).max(21),
  favorite: Joi.boolean(),
});

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
