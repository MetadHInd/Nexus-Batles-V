"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioModule = void 0;
const common_1 = require("@nestjs/common");
const twilio_strategy_1 = require("./strategies/twilio.strategy");
const messaging_strategy_manager_service_1 = require("./messaging-strategy-manager.service");
const messaging_strategy_controller_1 = require("./controllers/messaging-strategy.controller");
let TwilioModule = class TwilioModule {
};
exports.TwilioModule = TwilioModule;
exports.TwilioModule = TwilioModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [messaging_strategy_controller_1.MessagingStrategyController],
        providers: [twilio_strategy_1.TwilioStrategy, messaging_strategy_manager_service_1.MessagingStrategyManager],
        exports: [twilio_strategy_1.TwilioStrategy, messaging_strategy_manager_service_1.MessagingStrategyManager],
    })
], TwilioModule);
//# sourceMappingURL=twilio.module.js.map