import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { playerController } from '../../controllers/PlayerController';

const router = Router();

// GET /api/v1/players/rankings
router.get('/rankings', playerController.getRankings.bind(playerController));

// GET /api/v1/players/me
router.get('/me', authMiddleware, playerController.getMe.bind(playerController));

// PATCH /api/v1/players/me
router.patch('/me', authMiddleware, playerController.updateMe.bind(playerController));

// GET /api/v1/players/me/inventory
router.get('/me/inventory', authMiddleware, playerController.getInventory.bind(playerController));

// GET /api/v1/players/:id
router.get('/:id', playerController.getById.bind(playerController));

export default router;