"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const circuit_breaker_handler_1 = require("../../../../utils/circuit-breaker.handler");
const email_template_service_1 = require("./email-template.service");
let EmailService = EmailService_1 = class EmailService {
    templateService;
    logger = new common_1.Logger(EmailService_1.name);
    circuitBreaker = new circuit_breaker_handler_1.CircuitBreakerHandler();
    constructor(templateService) {
        this.templateService = templateService;
    }
    async send(email) {
        try {
            const smtp = {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE === 'true',
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
                service: process.env.SMTP_SERVICE,
            };
            this.logger.debug(`Sending email to ${Array.isArray(email.to) ? email.to.join(', ') : email.to}`);
            const transporter = nodemailer.createTransport({
                service: smtp.service,
                host: smtp.host,
                port: smtp.port,
                secure: smtp.secure,
                auth: {
                    user: smtp.user,
                    pass: smtp.pass,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });
            const mailOptions = {
                from: email.from || `"GALATEA Notifications" <${smtp.user}>`,
                to: email.to,
                subject: email.subject,
                text: email.text || '',
                html: email.html,
                attachments: email.attachments || [],
            };
            const info = await transporter.sendMail(mailOptions);
            this.logger.debug(`Email sent successfully: ${info.messageId}`);
            return {
                success: true,
                error: null,
                info,
            };
        }
        catch (error) {
            this.logger.error(`Email error: ${error instanceof Error ? error.message : String(error)}`);
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : typeof error === 'string'
                        ? error
                        : 'Unknown error',
                info: null,
            };
        }
    }
    async sendBulk(config, emails) {
        const results = [];
        for (const email of emails) {
            results.push(await this.send(email));
        }
        return results;
    }
    async sendWithTemplate(templateName, data, to, subject, from) {
        try {
            this.logger.debug(`Sending email with template: ${templateName}`);
            const html = await this.generateTemplate(templateName, data);
            const message = {
                to,
                subject,
                html,
                from,
            };
            return await this.send(message);
        }
        catch (error) {
            this.logger.error(`Error sending email with template '${templateName}': ${error.message}`, error.stack);
            return {
                success: false,
                error: error.message || 'Unknown error sending email with template',
                info: null,
            };
        }
    }
    async generateTemplate(templateName, data) {
        try {
            this.logger.debug(`Generating template: ${templateName}`);
            return await this.templateService.render(templateName, data);
        }
        catch (error) {
            this.logger.error(`Error generating template '${templateName}': ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_template_service_1.EmailTemplateService])
], EmailService);
//# sourceMappingURL=email.service.js.map