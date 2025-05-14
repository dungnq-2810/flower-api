import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import commentService from '../services/comment.service';
import { validate } from '../middlewares/validation.middleware';
import { createCommentSchema, updateCommentSchema } from '../validations/comment.validation';
import { HttpException } from '../middlewares/error.middleware';

export class CommentController {
  public createComment = [
    validate(createCommentSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          throw new HttpException(401, 'Authentication required');
        }
        
        // Use the id property which is already correctly set by auth middleware
        const userId = req.user.id;
        
        const comment = await commentService.createComment(userId, {
          ...req.body,
          userId,
        });
        
        res.status(201).json({
          status: 'success',
          data: {
            comment,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];
  
  public getCommentsByProductId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const productId = req.params.productId;
      // Convert string ID to number if it's a number
      const id = !isNaN(Number(productId)) ? Number(productId) : productId;
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await commentService.getCommentsByProductId(id, page, limit);
      
      res.status(200).json({
        status: 'success',
        data: {
          comments: result.comments,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  
  public getCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const commentId = req.params.id;
      // Convert string ID to number if it's a number
      const id = !isNaN(Number(commentId)) ? Number(commentId) : commentId;
      
      const comment = await commentService.getCommentById(id);
      
      res.status(200).json({
        status: 'success',
        data: {
          comment,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  
  public updateComment = [
    validate(updateCommentSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const commentId = req.params.id;
        // Convert string ID to number if it's a number
        const id = !isNaN(Number(commentId)) ? Number(commentId) : commentId;
        
        if (!req.user) {
          throw new HttpException(401, 'Authentication required');
        }
        
        // Use the id property which is already correctly set by auth middleware
        const userId = req.user.id;
        
        const updatedComment = await commentService.updateComment(
          id,
          userId,
          req.body
        );
        
        res.status(200).json({
          status: 'success',
          data: {
            comment: updatedComment,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];
  
  public deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const commentId = req.params.id;
      // Convert string ID to number if it's a number
      const id = !isNaN(Number(commentId)) ? Number(commentId) : commentId;
      
      if (!req.user) {
        throw new HttpException(401, 'Authentication required');
      }
      
      // Use the id property which is already correctly set by auth middleware
      const userId = req.user.id;
      
      await commentService.deleteComment(
        id,
        userId,
        req.user.role === 'admin'
      );
      
      res.status(200).json({
        status: 'success',
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new CommentController();
