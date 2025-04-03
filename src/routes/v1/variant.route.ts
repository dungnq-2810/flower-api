import { Router } from 'express';
import { VariantController } from '../../controllers/variant.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();
const variantController = new VariantController();

/**
 * @route   POST /api/v1/variants
 * @desc    Create a new variant
 * @access  Private (Admin)
 */
router.post('/', authenticate, authorize('admin'), variantController.createVariant);

/**
 * @route   GET /api/v1/variants/:id
 * @desc    Get variant by ID
 * @access  Public
 */
router.get('/:id', variantController.getVariantById);

/**
 * @route   GET /api/v1/variants/product/:productId
 * @desc    Get variants by product ID
 * @access  Public
 */
router.get('/product/:productId', variantController.getVariantsByProductId);

/**
 * @route   PUT /api/v1/variants/:id
 * @desc    Update variant
 * @access  Private (Admin)
 */
router.put('/:id', authenticate, authorize('admin'), variantController.updateVariant);

/**
 * @route   DELETE /api/v1/variants/:id
 * @desc    Delete variant
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, authorize('admin'), variantController.deleteVariant);

export default router;