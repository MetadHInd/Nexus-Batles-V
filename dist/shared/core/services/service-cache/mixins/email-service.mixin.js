"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithEmailService = WithEmailService;
const email_service_1 = require("../../../messaging/email/services/email.service");
const email_template_service_1 = require("../../../messaging/email/services/email-template.service");
function WithEmailService(Base) {
    return class extends Base {
        _emailTemplateService = new email_template_service_1.EmailTemplateService();
        _emailService = new email_service_1.EmailService(this._emailTemplateService);
        get EmailService() {
            return this._emailService;
        }
    };
}
//# sourceMappingURL=email-service.mixin.js.map