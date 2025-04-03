import { Router } from 'express';
import authController from '../../controllers/auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authController.register);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route GET /api/v1/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', authenticate, authController.getProfile);

export default router;
