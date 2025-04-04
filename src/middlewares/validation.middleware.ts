import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { HttpException } from "./error.middleware";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");

      next(new HttpException(400, errorMessage));
      return;
    }

    next();
  };
};
