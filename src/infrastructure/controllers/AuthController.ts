/**
 * AuthController.ts — Infrastructure / Controllers
 * Maneja register, login, logout y refresh de tokens.
 */

import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../application/usecases/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/usecases/auth/LoginUseCase';
import { playerRepository } from '../repositories/MySQLPlayerRepository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../security/jwt';
import { DomainError } from '../../domain/errors/DomainError';

const registerUseCase = new RegisterUseCase(playerRepository as any);
const loginUseCase    = new LoginUseCase(playerRepository as any);

export class AuthController {

  // POST /api/v1/auth/register
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const player = await registerUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: {
          id:       player.id,
          username: player.username,
          email:    player.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/v1/auth/login
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const player = await loginUseCase.execute(req.body);

      const accessToken  = signAccessToken({ sub: player.id, role: player.role });
      const refreshToken = signRefreshToken(player.id);

      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          player: {
            id:       player.id,
            username: player.username,
            role:     player.role,
          },
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

  // POST /api/v1/auth/logout
  async logout(req: Request, res: Response): Promise<void> {
    // Sin Redis/blacklist por ahora — el cliente borra sus tokens
    res.json({ success: true });
  }

  // POST /api/v1/auth/refresh
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
    } catch (err) {
      res.status(401).json({ success: false, error: 'INVALID_TOKEN' });
    }
  }
}

export const authController = new AuthController();
