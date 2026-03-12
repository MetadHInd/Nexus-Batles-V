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
var EmailTemplateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let EmailTemplateService = EmailTemplateService_1 = class EmailTemplateService {
    logger = new common_1.Logger(EmailTemplateService_1.name);
    templateCache = new Map();
    templateDir;
    constructor() {
        this.templateDir =
            process.env.EMAIL_TEMPLATES_DIR || path.resolve('templates/email');
        try {
            if (!fs.existsSync(this.templateDir)) {
                fs.mkdirSync(this.templateDir, { recursive: true });
                this.logger.log(`Created email templates directory: ${this.templateDir}`);
            }
        }
        catch (error) {
            this.logger.error(`Could not create email templates directory: ${error.message}`);
        }
    }
    async render(templateName, data = {}) {
        try {
            this.logger.debug(`Rendering template: ${templateName} with data: ${JSON.stringify(data)}`);
            let template = this.templateCache.get(templateName);
            if (!template) {
                this.logger.debug(`Template not in cache, loading from file`);
                template = await this.loadTemplate(templateName);
                this.templateCache.set(templateName, template);
            }
            const result = this.replaceVariables(template, data);
            this.logger.debug(`Template rendered successfully`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error rendering template '${templateName}': ${error.message}`, error.stack);
            return `
        <html>
          <body>
            <h1>Error al cargar la plantilla</h1>
            <p>No se pudo cargar la plantilla: ${templateName}</p>
            <p>Error: ${error.message}</p>
            <hr>
            <p>Los datos proporcionados fueron:</p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </body>
        </html>
      `;
        }
    }
    async loadTemplate(templateName) {
        try {
            const templatePath = path.join(this.templateDir, `${templateName}.html`);
            this.logger.debug(`Loading template from ${templatePath}`);
            const template = await fs.promises.readFile(templatePath, 'utf8');
            this.logger.debug(`Loaded template '${templateName}' successfully`);
            return template;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                this.logger.warn(`Template '${templateName}' not found, using default template`);
                return this.getDefaultTemplate();
            }
            this.logger.error(`Error loading template '${templateName}': ${error.message}`);
            throw error;
        }
    }
    replaceVariables(template, data) {
        const enhancedData = {
            currentYear: new Date().getFullYear(),
            appName: process.env.EMAIL_APP_NAME || 'Texel Sync',
            company: process.env.EMAIL_DEFAULT_COMPANY || 'Texel Bit SAS',
            supportEmail: process.env.EMAIL_SUPPORT_EMAIL || 'support@texelbit.com',
            companyAddress: process.env.EMAIL_COMPANY_ADDRESS || 'Texel Bit SAS, Colombia',
            ...data,
        };
        return template.replace(/{{(\w+)}}/g, (match, key) => {
            return enhancedData[key] !== undefined
                ? String(enhancedData[key])
                : match;
        });
    }
    getDefaultTemplate() {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; }
        .header { text-align: center; padding: 10px; background: linear-gradient(90deg, #6125a7 0%, #000000 100%); color: white; }
        .content { padding: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; padding: 10px; background: #f5f5f5; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{title}}</h1>
        </div>
        <div class="content">
            {{content}}
        </div>
        <div class="footer">
            <p>© {{currentYear}} {{company}}. Todos los derechos reservados.</p>
            <p>{{companyAddress}}<br>
            <a href="mailto:{{supportEmail}}">{{supportEmail}}</a></p>
        </div>
    </div>
</body>
</html>`;
    }
    clearCache() {
        this.templateCache.clear();
        this.logger.debug('Template cache cleared');
    }
    async saveTemplate(templateName, content) {
        try {
            const templatePath = path.join(this.templateDir, `${templateName}.html`);
            await fs.promises.writeFile(templatePath, content, 'utf8');
            this.templateCache.set(templateName, content);
            this.logger.log(`Template '${templateName}' saved successfully to ${templatePath}`);
        }
        catch (error) {
            this.logger.error(`Error saving template '${templateName}': ${error.message}`);
            throw new Error(`Failed to save email template: ${error.message}`);
        }
    }
    async listTemplates() {
        try {
            const files = await fs.promises.readdir(this.templateDir);
            return files
                .filter((file) => file.endsWith('.html'))
                .map((file) => file.replace('.html', ''));
        }
        catch (error) {
            this.logger.error(`Error listing templates: ${error.message}`);
            return [];
        }
    }
};
exports.EmailTemplateService = EmailTemplateService;
exports.EmailTemplateService = EmailTemplateService = EmailTemplateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailTemplateService);
//# sourceMappingURL=email-template.service.js.map