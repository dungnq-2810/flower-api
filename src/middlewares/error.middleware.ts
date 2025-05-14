import { Request, Response, NextFunction } from 'express';

export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  console.error(`[Error] ${status} - ${message}`);
  
  res.status(status).json({
    status: 'error',
    statusCode: status,
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};
