import { Types } from 'mongoose';
import BlogPost from '../models/blog-post.model';
import User from '../models/user.model';
import { IBlogPost, BlogPostDocument } from '../interfaces/models/blog-post.interface';
import { UserDocument } from '../interfaces/models/user.interface';
import { HttpException } from '../middlewares/error.middleware';

export class BlogPostService {
  public async createBlogPost(
    authorId: string | Types.ObjectId | number,
    blogPostData: IBlogPost
  ): Promise<BlogPostDocument> {
    // Check if slug exists
    const existingBlogPost = await BlogPost.findOne({ slug: blogPostData.slug });
    
    if (existingBlogPost) {
      throw new HttpException(409, 'Blog post with this slug already exists');
    }
    
    // Check if user exists by id or _id based on type
    const user = typeof authorId === 'number'
      ? await User.findOne({ id: authorId })
      : await User.findById(authorId);
    
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    
    const userObj = user.toObject<UserDocument>();
    
    const newBlogPost = await BlogPost.create({
      ...blogPostData,
      authorId: userObj.id,
      authorName: userObj.name,
    });
    
    return newBlogPost.toObject<BlogPostDocument>();
  }
  
  public async getBlogPostById(blogPostId: string | Types.ObjectId | number): Promise<BlogPostDocument> {
    // Find by id or _id based on type
    const blogPost = typeof blogPostId === 'number'
      ? await BlogPost.findOne({ id: blogPostId })
      : await BlogPost.findById(blogPostId);
    
    if (!blogPost) {
      throw new HttpException(404, 'Blog post not found');
    }
    
    return blogPost.toObject<BlogPostDocument>();
  }
  
  public async getBlogPostBySlug(slug: string): Promise<BlogPostDocument> {
    const blogPost = await BlogPost.findOne({ slug });
    
    if (!blogPost) {
      throw new HttpException(404, 'Blog post not found');
    }
    
    return blogPost.toObject<BlogPostDocument>();
  }
  
  public async getAllBlogPosts(
    page: number = 1,
    limit: number = 10,
    filter: Record<string, any> = {}
  ): Promise<{ blogPosts: BlogPostDocument[]; totalCount: number; totalPages: number }> {
    const query: Record<string, any> = {};
    
    if (filter.authorId) {
      query.authorId = filter.authorId;
    }
    
    if (filter.tag) {
      query.tags = { $in: [filter.tag] };
    }
    
    if (filter.search) {
      query.$or = [
        { title: { $regex: filter.search, $options: 'i' } },
        { content: { $regex: filter.search, $options: 'i' } },
        { excerpt: { $regex: filter.search, $options: 'i' } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [blogPosts, totalCount] = await Promise.all([
      BlogPost.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('authorId', 'name avatar'),
      BlogPost.countDocuments(query),
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return { 
      blogPosts: blogPosts.map(post => post.toObject<BlogPostDocument>()), 
      totalCount, 
      totalPages 
    };
  }
  
  public async updateBlogPost(
    blogPostId: string | Types.ObjectId | number,
    blogPostData: Partial<IBlogPost>
  ): Promise<BlogPostDocument> {
    // Find by id or _id based on type
    const blogPost = typeof blogPostId === 'number'
      ? await BlogPost.findOne({ id: blogPostId })
      : await BlogPost.findById(blogPostId);
    
    if (!blogPost) {
      throw new HttpException(404, 'Blog post not found');
    }
    
    const blogPostObj = blogPost.toObject<BlogPostDocument>();
    
    // Check if slug exists (if trying to update slug)
    if (blogPostData.slug && blogPostData.slug !== blogPostObj.slug) {
      const searchQuery = typeof blogPostId === 'number'
        ? { slug: blogPostData.slug, id: { $ne: blogPostId } }
        : { slug: blogPostData.slug, _id: { $ne: blogPostId } };
        
      const existingBlogPost = await BlogPost.findOne(searchQuery);
      
      if (existingBlogPost) {
        throw new HttpException(409, 'Blog post with this slug already exists');
      }
    }
    
    // Update by numeric id if blogPostId is a number
    const updatedBlogPost = typeof blogPostId === 'number'
      ? await BlogPost.findOneAndUpdate(
          { id: blogPostId },
          blogPostData,
          { new: true }
        )
      : await BlogPost.findByIdAndUpdate(
          blogPostId,
          blogPostData,
          { new: true }
        );
    
    if (!updatedBlogPost) {
      throw new HttpException(404, 'Blog post not found');
    }
    
    return updatedBlogPost.toObject<BlogPostDocument>();
  }
  
  public async deleteBlogPost(blogPostId: string | Types.ObjectId | number): Promise<void> {
    // Delete by numeric id if blogPostId is a number
    const result = typeof blogPostId === 'number'
      ? await BlogPost.findOneAndDelete({ id: blogPostId })
      : await BlogPost.findByIdAndDelete(blogPostId);
    
    if (!result) {
      throw new HttpException(404, 'Blog post not found');
    }
  }
}

export default new BlogPostService();
