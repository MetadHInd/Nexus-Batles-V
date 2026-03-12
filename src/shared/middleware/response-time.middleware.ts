// response-time.middleware.ts
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class ResponseTimeMiddleware implements NestMiddleware {
  use(
    _req: Request,
    res: Response & { ms?: number },
    next: NextFunction,
  ): void {
    res.ms = Date.now();
    next();
  }
}
