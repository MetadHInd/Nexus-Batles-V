import { IEmailService } from '../../application/usecases/auth/RegisterUser';
export declare class EmailService implements IEmailService {
    sendConfirmation(email: string): Promise<void>;
    sendPasswordReset(email: string, token: string): Promise<void>;
}
//# sourceMappingURL=EmailService.d.ts.map