import Joi from 'joi';

export const createBlogPostSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  excerpt: Joi.string().allow('', null),
  content: Joi.string().allow('', null),
  image: Joi.string().allow('', null),
  tags: Joi.array().items(Joi.string()).allow(null),
});

export const updateBlogPostSchema = Joi.object({
  title: Joi.string(),
  slug: Joi.string(),
  excerpt: Joi.string().allow('', null),
  content: Joi.string().allow('', null),
  image: Joi.string().allow('', null),
  tags: Joi.array().items(Joi.string()).allow(null),
});
