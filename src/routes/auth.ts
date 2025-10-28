import { Router } from 'express';
import { login, refreshToken, getMe, logout } from '../controllers/authController';
import { authenticateToken, authenticateRefreshToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { loginSchema } from '../middleware/validation';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// POST /api/auth/refresh
router.post('/refresh', authenticateRefreshToken, refreshToken);

// GET /api/auth/me
router.get('/me', authenticateToken, getMe);

// POST /api/auth/logout
router.post('/logout', authenticateToken, logout);

export default router;

