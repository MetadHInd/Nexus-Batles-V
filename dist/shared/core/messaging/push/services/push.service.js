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
var PushService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const circuit_breaker_handler_1 = require("../../../../utils/circuit-breaker.handler");
let PushService = PushService_1 = class PushService {
    httpService;
    logger = new common_1.Logger(PushService_1.name);
    circuitBreaker = new circuit_breaker_handler_1.CircuitBreakerHandler();
    constructor(httpService) {
        this.httpService = httpService;
    }
    async send(message) {
        const sendFunction = async () => {
            try {
                const appId = process.env.ONESIGNAL_APP_ID;
                const apiKey = process.env.ONESIGNAL_API_KEY;
                const provider = process.env.PUSH_PROVIDER || 'onesignal';
                if (!appId || !apiKey) {
                    throw new Error('Push notification credentials missing');
                }
                let response;
                switch (provider.toLowerCase()) {
                    case 'onesignal':
                        response = await this.sendOneSignalPush(appId, apiKey, message);
                        break;
                    case 'firebase':
                        response = await this.sendFirebasePush(apiKey, message);
                        break;
                    default:
                        throw new Error(`Unsupported push provider: ${provider}`);
                }
                return {
                    success: true,
                    error: null,
                    id: response.id || response.messageId || 'unknown',
                    recipients: response.recipients || 1,
                    details: response,
                };
            }
            catch (error) {
                this.logger.error(`Push notification error: ${error.message}`, error.stack);
                return {
                    success: false,
                    error: error.message,
                    code: error.code || 'unknown',
                    id: null,
                };
            }
        };
        const breaker = this.circuitBreaker.createBreaker(sendFunction);
        return (await breaker.fire());
    }
    async sendBulk(messages) {
        const results = [];
        for (const message of messages) {
            results.push(await this.send(message));
        }
        return results;
    }
    async sendOneSignalPush(appId, apiKey, message) {
        const url = 'https://onesignal.com/api/v1/notifications';
        const playerIds = Array.isArray(message.recipient.value)
            ? message.recipient.value
            : [message.recipient.value];
        const payload = {
            app_id: appId,
            name: message.content.title,
            include_player_ids: playerIds,
            headings: {
                en: message.content.title,
            },
            contents: {
                en: message.content.body,
            },
            ...(message.content.data && {
                data: message.content.data,
            }),
            ...(message.content.url && {
                url: message.content.url,
            }),
            ...(message.content.buttons && {
                buttons: message.content.buttons,
            }),
        };
        const headers = {
            Authorization: `Basic ${apiKey}`,
            'Content-Type': 'application/json',
        };
        this.logger.debug(`Sending OneSignal push notification with payload: ${JSON.stringify(payload)}`);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload, { headers }));
            this.logger.log(`OneSignal push notification sent successfully: ${JSON.stringify(response.data)}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`OneSignal error details: ${JSON.stringify(error.response?.data || 'No details')}`);
            throw error;
        }
    }
    async sendFirebasePush(apiKey, message) {
        const url = 'https://fcm.googleapis.com/fcm/send';
        let to;
        let registration_ids;
        if (message.recipient.type === 'player_id') {
            if (Array.isArray(message.recipient.value)) {
                registration_ids = message.recipient.value;
            }
            else {
                to = message.recipient.value;
            }
        }
        else if (message.recipient.type === 'topic') {
            to = `/topics/${message.recipient.value}`;
        }
        const payload = {
            ...(to && { to }),
            ...(registration_ids && { registration_ids }),
            notification: {
                title: message.content.title,
                body: message.content.body,
                image: message.content.imageUrl,
                click_action: message.content.url,
            },
            data: message.content.data || {},
            ...(message.priority && { priority: message.priority }),
        };
        const headers = {
            Authorization: `key=${apiKey}`,
            'Content-Type': 'application/json',
        };
        this.logger.debug(`Sending Firebase push notification with payload: ${JSON.stringify(payload)}`);
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload, { headers }));
        return {
            id: response.data.multicast_id || 'unknown',
            messageId: response.data.message_id,
            recipients: response.data.success || 0,
            ...response.data,
        };
    }
};
exports.PushService = PushService;
exports.PushService = PushService = PushService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], PushService);
//# sourceMappingURL=push.service.js.map