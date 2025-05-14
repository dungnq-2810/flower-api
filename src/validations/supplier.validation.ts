import Joi from 'joi';

export const createSupplierSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  contactPerson: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').default('active')
});

export const updateSupplierSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  address: Joi.string(),
  contactPerson: Joi.string(),
  status: Joi.string().valid('active', 'inactive')
}).min(1);