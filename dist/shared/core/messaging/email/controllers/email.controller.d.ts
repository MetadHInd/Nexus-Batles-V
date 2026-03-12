import { EmailService } from '../services/email.service';
import { EmailTemplateService } from '../services/email-template.service';
import { EmailResult } from '../interfaces/email-result.interface';
import { SendEmailDto, SendBulkEmailDto, SendTemplateEmailDto } from '../dtos/email-dtos';
export declare class EmailController {
    private readonly emailService;
    private readonly templateService;
    constructor(emailService: EmailService, templateService: EmailTemplateService);
    send(dto: SendEmailDto): Promise<EmailResult>;
    sendBulk(dto: SendBulkEmailDto): Promise<EmailResult[]>;
    sendTemplate(dto: SendTemplateEmailDto): Promise<EmailResult>;
}
