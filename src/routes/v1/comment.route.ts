import { Router } from 'express';
import commentController from '../../controllers/comment.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @route POST /api/v1/comments
 * @desc Create a new comment
 * @access Private
 */
router.post('/', authenticate, commentController.createComment);

/**
 * @route GET /api/v1/comments/product/:productId
 * @desc Get comments by product ID
 * @access Public
 */
router.get('/product/:productId', commentController.getCommentsByProductId);

/**
 * @route GET /api/v1/comments/:id
 * @desc Get comment by ID
 * @access Public
 */
router.get('/:id', commentController.getCommentById);

/**
 * @route PUT /api/v1/comments/:id
 * @desc Update comment
 * @access Private (Owner)
 */
router.put('/:id', authenticate, commentController.updateComment);

/**
 * @route DELETE /api/v1/comments/:id
 * @desc Delete comment
 * @access Private (Owner or Admin)
 */
router.delete('/:id', authenticate, commentController.deleteComment);

export default router;
