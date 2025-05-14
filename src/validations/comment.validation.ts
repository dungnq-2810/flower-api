import Joi from 'joi';

export const createCommentSchema = Joi.object({
  productId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  content: Joi.string().allow('', null),
});

export const updateCommentSchema = Joi.object({
  rating: Joi.number().min(1).max(5),
  content: Joi.string().allow('', null),
});
