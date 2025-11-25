import express from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateAuth } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', validateAuth, authController.register);
router.post('/login', validateAuth, authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

export default router;