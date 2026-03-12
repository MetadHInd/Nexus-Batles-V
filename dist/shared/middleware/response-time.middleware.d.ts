import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class ResponseTimeMiddleware implements NestMiddleware {
    use(_req: Request, res: Response & {
        ms?: number;
    }, next: NextFunction): void;
}
