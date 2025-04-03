import { Types } from 'mongoose';
import Comment from '../models/comment.model';
import Product from '../models/product.model';
import User from '../models/user.model';
import { IComment, CommentDocument } from '../interfaces/models/comment.interface';
import { UserDocument } from '../interfaces/models/user.interface';
import { ProductDocument } from '../interfaces/models/product.interface';
import { HttpException } from '../middlewares/error.middleware';

export class CommentService {
  public async createComment(
    userId: string | Types.ObjectId | number,
    commentData: IComment
  ): Promise<CommentDocument> {
    // Check if product exists by id or _id based on type
    const product = typeof commentData.productId === 'number'
      ? await Product.findOne({ id: commentData.productId })
      : await Product.findById(commentData.productId);
    
    if (!product) {
      throw new HttpException(404, 'Product not found');
    }
    
    // Check if user exists by id or _id based on type
    const user = typeof userId === 'number'
      ? await User.findOne({ id: userId })
      : await User.findById(userId);
    
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    
    const userObj = user.toObject<UserDocument>();
    
    const comment = await Comment.create({
      ...commentData,
      userId: userObj.id,
      userName: userObj.name,
      userAvatar: userObj.avatar,
    });
    
    // Update product rating
    await this.updateProductRating(product.id);
    
    return comment.toObject<CommentDocument>();
  }
  
  public async getCommentById(commentId: string | Types.ObjectId | number): Promise<CommentDocument> {
    // Find by id or _id based on type
    const comment = typeof commentId === 'number'
      ? await Comment.findOne({ id: commentId })
      : await Comment.findById(commentId);
    
    if (!comment) {
      throw new HttpException(404, 'Comment not found');
    }
    
    return comment.toObject<CommentDocument>();
  }
  
  public async getCommentsByProductId(
    productId: string | Types.ObjectId | number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ comments: CommentDocument[]; totalCount: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    const [comments, totalCount] = await Promise.all([
      Comment.find({ productId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Comment.countDocuments({ productId }),
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return { 
      comments: comments.map(comment => comment.toObject<CommentDocument>()), 
      totalCount, 
      totalPages 
    };
  }
  
  public async updateComment(
    commentId: string | Types.ObjectId | number,
    userId: string | Types.ObjectId | number,
    commentData: Partial<IComment>
  ): Promise<CommentDocument> {
    // Find by id or _id based on type
    const comment = typeof commentId === 'number'
      ? await Comment.findOne({ id: commentId })
      : await Comment.findById(commentId);
    
    if (!comment) {
      throw new HttpException(404, 'Comment not found');
    }
    
    const commentObj = comment.toObject<CommentDocument>();
    
    // Get numeric userId regardless of input type
    const numericUserId = typeof userId === 'number' 
      ? userId 
      : typeof userId === 'string' ? Number(userId) : Number(userId.toString());
    
    // Check if the user owns the comment
    if (commentObj.userId !== numericUserId) {
      throw new HttpException(403, 'You do not have permission to update this comment');
    }
    
    // Update by numeric id if commentId is a number
    const updatedComment = typeof commentId === 'number'
      ? await Comment.findOneAndUpdate(
          { id: commentId },
          commentData,
          { new: true }
        )
      : await Comment.findByIdAndUpdate(
          commentId,
          commentData,
          { new: true }
        );
    
    if (!updatedComment) {
      throw new HttpException(404, 'Comment not found');
    }
    
    // Update product rating if rating was changed
    if (commentData.rating) {
      await this.updateProductRating(commentObj.productId);
    }
    
    return updatedComment.toObject<CommentDocument>();
  }
  
  public async deleteComment(
    commentId: string | Types.ObjectId | number,
    userId: string | Types.ObjectId | number,
    isAdmin: boolean = false
  ): Promise<void> {
    // Find by id or _id based on type
    const comment = typeof commentId === 'number'
      ? await Comment.findOne({ id: commentId })
      : await Comment.findById(commentId);
    
    if (!comment) {
      throw new HttpException(404, 'Comment not found');
    }
    
    const commentObj = comment.toObject<CommentDocument>();
    
    // Get numeric userId regardless of input type
    const numericUserId = typeof userId === 'number' 
      ? userId 
      : typeof userId === 'string' ? Number(userId) : Number(userId.toString());
    
    // Check if the user owns the comment or is admin
    if (commentObj.userId !== numericUserId && !isAdmin) {
      throw new HttpException(403, 'You do not have permission to delete this comment');
    }
    
    // Delete by numeric id if commentId is a number
    typeof commentId === 'number'
      ? await Comment.findOneAndDelete({ id: commentId })
      : await Comment.findByIdAndDelete(commentId);
    
    // Update product rating
    await this.updateProductRating(commentObj.productId);
  }
  
  private async updateProductRating(productId: string | Types.ObjectId | number): Promise<void> {
    const comments = await Comment.find({ productId, rating: { $exists: true } });
    
    if (comments.length === 0) {
      // No ratings yet, set to default values
      // Update by numeric id if productId is a number
      typeof productId === 'number'
        ? await Product.findOneAndUpdate(
            { id: productId },
            {
              rating: 0,
              reviewCount: 0,
            }
          )
        : await Product.findByIdAndUpdate(
            productId,
            {
              rating: 0,
              reviewCount: 0,
            }
          );
      return;
    }
    
    const totalRating = comments.reduce((sum, comment) => sum + ((comment as any).rating || 0), 0);
    const averageRating = totalRating / comments.length;
    
    // Update by numeric id if productId is a number
    typeof productId === 'number'
      ? await Product.findOneAndUpdate(
          { id: productId },
          {
            rating: averageRating,
            reviewCount: comments.length,
          }
        )
      : await Product.findByIdAndUpdate(
          productId,
          {
            rating: averageRating,
            reviewCount: comments.length,
          }
        );
  }
}

export default new CommentService();
