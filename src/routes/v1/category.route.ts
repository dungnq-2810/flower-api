import { Router } from 'express';
import categoryController from '../../controllers/category.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @route POST /api/v1/categories
 * @desc Create a new category
 * @access Private (Admin)
 */
router.post('/', authenticate, authorize('admin'), categoryController.createCategory);

/**
 * @route GET /api/v1/categories
 * @desc Get all categories
 * @access Public
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route GET /api/v1/categories/:id
 * @desc Get category by ID
 * @access Public
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @route GET /api/v1/categories/slug/:slug
 * @desc Get category by slug
 * @access Public
 */
router.get('/slug/:slug', categoryController.getCategoryBySlug);

/**
 * @route PUT /api/v1/categories/:id
 * @desc Update category
 * @access Private (Admin)
 */
router.put('/:id', authenticate, authorize('admin'), categoryController.updateCategory);

/**
 * @route DELETE /api/v1/categories/:id
 * @desc Delete category
 * @access Private (Admin)
 */
router.delete('/:id', authenticate, authorize('admin'), categoryController.deleteCategory);

export default router;
