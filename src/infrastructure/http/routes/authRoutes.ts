import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validateMiddleware';
import { authController } from '../../controllers/AuthController';

const router = Router();

const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login',    validate(loginSchema),    authController.login.bind(authController));
router.post('/logout',                             authController.logout.bind(authController));
router.post('/refresh',                            authController.refresh.bind(authController));

export default router;
