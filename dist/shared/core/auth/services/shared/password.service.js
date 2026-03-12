"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const config_constants_enum_1 = require("../../../../constants/config.constants.enum");
const generic_error_messages_enum_1 = require("../../../../constants/generic-error-messages.enum");
const message_formatter_1 = require("../../../../utils/message-formatter");
let PasswordService = class PasswordService {
    async hashPassword(password) {
        const requiredLength = Number(config_constants_enum_1.ConfigConstants.PASSWORD_REQUIRED_SIZE);
        if (!password || password.length < requiredLength) {
            throw new Error((0, message_formatter_1.formatMessage)(generic_error_messages_enum_1.GenericErrorMessages.PASSWORD_REQUIRED_SIZE, requiredLength));
        }
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    async validatePassword(plain, hashed) {
        return await bcrypt.compare(plain, hashed);
    }
};
exports.PasswordService = PasswordService;
exports.PasswordService = PasswordService = __decorate([
    (0, common_1.Injectable)()
], PasswordService);
//# sourceMappingURL=password.service.js.map