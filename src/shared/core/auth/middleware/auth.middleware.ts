import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/shared/token.service';
import { GenericErrorMessages } from 'src/shared/constants/generic-error-messages.enum';
import { UserAuth } from '../interfaces/shared/user-auth.interface';
import { ErrorCodesEnum } from 'src/shared/errors/error-codes.enum';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.header('authorization');

      if (!token) {
        return next({
          status: 401,
          printMessage: GenericErrorMessages.INVALID_JWT_TOKEN,
        });
      }

      if (token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
      }

      const payload = (await this.tokenService.validateToken(
        token,
      )) as UserAuth;
      req['user'] = payload;

      next();
    } catch {
      return next({
        status: ErrorCodesEnum.UNAUTHORIZED,
        printMessage: GenericErrorMessages.INVALID_JWT_TOKEN,
      });
    }
  }
}
