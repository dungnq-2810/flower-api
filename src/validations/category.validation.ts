import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string().allow('', null),
  image: Joi.string().allow('', null),
  productCount: Joi.number().min(0).allow(null),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string(),
  slug: Joi.string(),
  description: Joi.string().allow('', null),
  image: Joi.string().allow('', null),
  productCount: Joi.number().min(0).allow(null),
});
