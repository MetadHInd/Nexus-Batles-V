"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushMixin = void 0;
exports.WithPush = WithPush;
class PushMixin {
    pushService;
    async send(message) {
        if (!this.pushService) {
            throw new Error('PushService not initialized');
        }
        return await this.pushService.send(message);
    }
    validateConfig() {
        return !!this.pushService;
    }
}
exports.PushMixin = PushMixin;
function WithPush(Base) {
    return class extends Base {
        pushService;
        async send(message) {
            const mixin = new PushMixin();
            mixin.pushService = this.pushService;
            return await mixin.send(message);
        }
        validateConfig() {
            return !!this.pushService;
        }
    };
}
//# sourceMappingURL=push.mixin.js.map