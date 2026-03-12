import { AppService } from './app.service';
import { Response } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getRoot(res: Response): void;
    getLogin(res: Response): void;
    getHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
    };
}
