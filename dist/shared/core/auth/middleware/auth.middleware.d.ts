import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/shared/token.service';
export declare class AuthMiddleware implements NestMiddleware {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
