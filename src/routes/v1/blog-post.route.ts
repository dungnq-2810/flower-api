import { Router } from 'express';
import blogPostController from '../../controllers/blog-post.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @route POST /api/v1/blog-posts
 * @desc Create a new blog post
 * @access Private
 */
router.post('/', authenticate, blogPostController.createBlogPost);

/**
 * @route GET /api/v1/blog-posts
 * @desc Get all blog posts
 * @access Public
 */
router.get('/', blogPostController.getAllBlogPosts);

/**
 * @route GET /api/v1/blog-posts/:id
 * @desc Get blog post by ID
 * @access Public
 */
router.get('/:id', blogPostController.getBlogPostById);

/**
 * @route GET /api/v1/blog-posts/slug/:slug
 * @desc Get blog post by slug
 * @access Public
 */
router.get('/slug/:slug', blogPostController.getBlogPostBySlug);

/**
 * @route PUT /api/v1/blog-posts/:id
 * @desc Update blog post
 * @access Private (Owner or Admin)
 */
router.put('/:id', authenticate, blogPostController.updateBlogPost);

/**
 * @route DELETE /api/v1/blog-posts/:id
 * @desc Delete blog post
 * @access Private (Owner or Admin)
 */
router.delete('/:id', authenticate, blogPostController.deleteBlogPost);

export default router;
