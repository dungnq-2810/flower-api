import { Request, Response, NextFunction } from 'express';
import blogPostService from '../services/blog-post.service';
import { validate } from '../middlewares/validation.middleware';
import { createBlogPostSchema, updateBlogPostSchema } from '../validations/blog-post.validation';
import { HttpException } from '../middlewares/error.middleware';

export class BlogPostController {
  public createBlogPost = [
    validate(createBlogPostSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          throw new HttpException(401, 'Authentication required');
        }
        
        const blogPost = await blogPostService.createBlogPost(req.user.id, req.body);
        
        res.status(201).json({
          status: 'success',
          data: {
            blogPost,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];
  
  public getAllBlogPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const filter: Record<string, any> = {};
      
      if (req.query.authorId) {
        filter.authorId = req.query.authorId;
      }
      
      if (req.query.tag) {
        filter.tag = req.query.tag;
      }
      
      if (req.query.search) {
        filter.search = req.query.search;
      }
      
      const result = await blogPostService.getAllBlogPosts(page, limit, filter);
      
      res.status(200).json({
        status: 'success',
        data: {
          blogPosts: result.blogPosts,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  
  public getBlogPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const blogPostId = req.params.id;
      // Convert string ID to number if it's a number
      const id = !isNaN(Number(blogPostId)) ? Number(blogPostId) : blogPostId;
      
      const blogPost = await blogPostService.getBlogPostById(id);
      
      res.status(200).json({
        status: 'success',
        data: {
          blogPost,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  
  public getBlogPostBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const slug = req.params.slug;
      
      const blogPost = await blogPostService.getBlogPostBySlug(slug);
      
      res.status(200).json({
        status: 'success',
        data: {
          blogPost,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  
  public updateBlogPost = [
    validate(updateBlogPostSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const blogPostId = req.params.id;
        // Convert string ID to number if it's a number
        const id = !isNaN(Number(blogPostId)) ? Number(blogPostId) : blogPostId;
        
        if (!req.user) {
          throw new HttpException(401, 'Authentication required');
        }
        
        // Get the blog post to check ownership
        const existingBlogPost = await blogPostService.getBlogPostById(id);
        
        // Check if user is the author or an admin
        if (existingBlogPost.authorId !== req.user.id && req.user.role !== 'admin') {
          throw new HttpException(403, 'You do not have permission to update this blog post');
        }
        
        const updatedBlogPost = await blogPostService.updateBlogPost(id, req.body);
        
        res.status(200).json({
          status: 'success',
          data: {
            blogPost: updatedBlogPost,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];
  
  public deleteBlogPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const blogPostId = req.params.id;
      // Convert string ID to number if it's a number
      const id = !isNaN(Number(blogPostId)) ? Number(blogPostId) : blogPostId;
      
      if (!req.user) {
        throw new HttpException(401, 'Authentication required');
      }
      
      // Get the blog post to check ownership
      const existingBlogPost = await blogPostService.getBlogPostById(id);
      
      // Check if user is the author or an admin
      if (existingBlogPost.authorId !== req.user.id && req.user.role !== 'admin') {
        throw new HttpException(403, 'You do not have permission to delete this blog post');
      }
      
      await blogPostService.deleteBlogPost(id);
      
      res.status(200).json({
        status: 'success',
        message: 'Blog post deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new BlogPostController();
