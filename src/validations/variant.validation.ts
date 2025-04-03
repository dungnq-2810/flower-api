import Joi from 'joi';

export const createVariantSchema = Joi.object({
  productId: Joi.number().required(),
  size: Joi.string().required(),
  variant: Joi.string().required(),
  price: Joi.number().min(0).required(),
  stockQuantity: Joi.number().min(0).required()
});

export const updateVariantSchema = Joi.object({
  size: Joi.string(),
  variant: Joi.string(),
  price: Joi.number().min(0),
  stockQuantity: Joi.number().min(0)
}).min(1);