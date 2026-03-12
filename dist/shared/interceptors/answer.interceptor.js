"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const answer_manager_1 = require("../utils/answer-manager");
let AnswerInterceptor = class AnswerInterceptor {
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        if (req.url && req.url.includes('/sse/')) {
            return next.handle();
        }
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            answer_manager_1.AnswerManager.handleSuccess(res, data);
        }));
    }
};
exports.AnswerInterceptor = AnswerInterceptor;
exports.AnswerInterceptor = AnswerInterceptor = __decorate([
    (0, common_1.Injectable)()
], AnswerInterceptor);
//# sourceMappingURL=answer.interceptor.js.map