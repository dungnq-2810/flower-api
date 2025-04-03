import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { HttpException } from '../middlewares/error.middleware';
import { UserDocument } from '../interfaces/models/user.interface';
import User from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(401, 'Authentication required');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new HttpException(401, 'Authentication required');
    }
    
    const decoded = verifyToken(token);
    // Try to find by numeric id first, then by MongoDB _id
    let user = await User.findOne({ id: Number(decoded.id) });
    
    if (!user) {
      // Fallback to MongoDB's _id
      user = await User.findById(decoded.id);
      
      if (!user) {
        throw new HttpException(401, 'User not found');
      }
    }
    
    // Convert to UserDocument to ensure proper typing
    req.user = user.toObject<UserDocument>();
    next();
  } catch (error) {
    next(new HttpException(401, 'Invalid or expired token'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new HttpException(401, 'Authentication required'));
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      next(new HttpException(403, 'You do not have permission to perform this action'));
      return;
    }
    
    next();
  };
};
