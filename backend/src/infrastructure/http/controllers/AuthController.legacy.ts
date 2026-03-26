/**
 * AuthController.legacy.ts — Infrastructure / HTTP / Controllers
 * Controlador de Auth para el flujo de Player (v1).
 * Exporta singleton `authController` usado por authRoutes.ts
 *
 * FIXES:
 *  - Renombrado de AuthController para evitar colisión con AuthController.ts (v2)
 *  - Importa playerRepository desde '../repositories/MySQLPlayerRepository' (ruta correcta)
 *  - Usa bcrypt directamente (no RegisterUseCase/LoginUseCase que no existen)
 */

import { Request, Response, NextFunction } from 'express';
import { playerRepository }               from '../../repositories/MySQLPlayerRepository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../security/jwt';
import { DomainError }                    from '../../../domain/errors/DomainError';
import bcrypt                             from 'bcrypt';

class AuthControllerLegacy {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password } = req.body;

      const existing = await playerRepository.findByEmail(email);
      if (existing) {
        res.status(409).json({ success: false, error: 'EMAIL_TAKEN' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const player = await playerRepository.save({ username, email, passwordHash, role: 'PLAYER', rank: 0, coins: 0 });

      res.status(201).json({
        success: true,
        data: { id: player.id, username: player.username, email: player.email },
      });
    } catch (err) { next(err); }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const player = await playerRepository.findByEmail(email);

      if (!player || !(await bcrypt.compare(password, player.passwordHash))) {
        res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS' });
        return;
      }

      const accessToken  = signAccessToken({ sub: player.id, role: player.role });
      const refreshToken = signRefreshToken(player.id);

      res.json({
        success: true,
        data: {
          accessToken, refreshToken,
          player: { id: player.id, username: player.username, role: player.role },
        },
      });
    } catch (err: any) {
      if (err instanceof DomainError && err.code === 'UNAUTHORIZED') {
        res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS', message: err.message });
        return;
      }
      next(err);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    res.json({ success: true });
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ success: false, error: 'REFRESH_TOKEN_REQUIRED' });
        return;
      }

      const payload = verifyRefreshToken(refreshToken);
      const player  = await playerRepository.findById(payload.sub);

      if (!player) {
        res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
        return;
      }

      const accessToken = signAccessToken({ sub: player.id, role: player.role });
      res.json({ success: true, data: { accessToken } });
    } catch {
      res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
    }
  }
}

export const authController = new AuthControllerLegacy();
