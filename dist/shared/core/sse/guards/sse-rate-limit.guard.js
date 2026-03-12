"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SSERateLimitGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSERateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
let SSERateLimitGuard = SSERateLimitGuard_1 = class SSERateLimitGuard {
    logger = new common_1.Logger(SSERateLimitGuard_1.name);
    connectionAttempts = new Map();
    activeConnections = new Map();
    config = {
        maxAttemptsPerWindow: 5,
        windowMs: 60000,
        maxConcurrentPerIp: 1,
        maxGlobalConnections: 10000,
        enableWhitelist: false,
        whitelist: ['127.0.0.1', '::1', '::ffff:127.0.0.1'],
    };
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const ip = this.getClientIp(request);
        if (this.config.enableWhitelist && this.config.whitelist.includes(ip)) {
            this.logger.debug(`IP ${ip} whitelisted, skipping rate limit`);
            return true;
        }
        const globalConnections = this.getTotalActiveConnections();
        if (globalConnections >= this.config.maxGlobalConnections) {
            this.logger.error(`🚫 Global connection limit reached: ${globalConnections}`);
            throw new common_1.HttpException('Server at maximum capacity. Please try again later.', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        const currentConnections = this.activeConnections.get(ip) || 0;
        if (currentConnections >= this.config.maxConcurrentPerIp) {
            this.logger.warn(`🚫 IP ${ip} exceeded concurrent connection limit: ${currentConnections}`);
            throw new common_1.HttpException(`Too many concurrent connections from your IP. Maximum: ${this.config.maxConcurrentPerIp}`, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const now = Date.now();
        const attempts = this.connectionAttempts.get(ip) || [];
        const recentAttempts = attempts.filter((timestamp) => now - timestamp < this.config.windowMs);
        if (recentAttempts.length >= this.config.maxAttemptsPerWindow) {
            this.logger.warn(`🚫 IP ${ip} exceeded connection attempt limit: ${recentAttempts.length} attempts in ${this.config.windowMs}ms`);
            throw new common_1.HttpException(`Too many connection attempts. Please wait ${Math.ceil(this.config.windowMs / 1000)} seconds.`, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        recentAttempts.push(now);
        this.connectionAttempts.set(ip, recentAttempts);
        this.activeConnections.set(ip, currentConnections + 1);
        this.logger.debug(`✅ Rate limit passed for IP ${ip} (${currentConnections + 1}/${this.config.maxConcurrentPerIp} connections)`);
        return true;
    }
    getClientIp(request) {
        const forwarded = request.headers['x-forwarded-for'];
        if (forwarded && typeof forwarded === 'string') {
            return forwarded.split(',')[0].trim();
        }
        const realIp = request.headers['x-real-ip'];
        if (realIp && typeof realIp === 'string') {
            return realIp;
        }
        return request.ip || request.socket.remoteAddress || 'unknown';
    }
    decrementConnection(ip) {
        const current = this.activeConnections.get(ip) || 0;
        if (current > 0) {
            this.activeConnections.set(ip, current - 1);
            this.logger.debug(`Connection closed for IP ${ip} (${current - 1} remaining)`);
        }
        if (current - 1 <= 0) {
            this.activeConnections.delete(ip);
        }
    }
    getTotalActiveConnections() {
        let total = 0;
        this.activeConnections.forEach((count) => {
            total += count;
        });
        return total;
    }
    updateConfig(config) {
        Object.assign(this.config, config);
        this.logger.log('⚙️ Rate limit configuration updated');
    }
    getStats() {
        return {
            activeConnections: Object.fromEntries(this.activeConnections),
            totalActiveConnections: this.getTotalActiveConnections(),
            ipsWithAttempts: this.connectionAttempts.size,
            config: this.config,
        };
    }
    resetIp(ip) {
        this.connectionAttempts.delete(ip);
        this.activeConnections.delete(ip);
        this.logger.log(`🔓 Rate limit reset for IP ${ip}`);
    }
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        this.connectionAttempts.forEach((attempts, ip) => {
            const recent = attempts.filter((timestamp) => now - timestamp < this.config.windowMs);
            if (recent.length === 0) {
                this.connectionAttempts.delete(ip);
                cleaned++;
            }
            else if (recent.length < attempts.length) {
                this.connectionAttempts.set(ip, recent);
            }
        });
        if (cleaned > 0) {
            this.logger.debug(`🧹 Cleaned up ${cleaned} old rate limit entries`);
        }
    }
};
exports.SSERateLimitGuard = SSERateLimitGuard;
exports.SSERateLimitGuard = SSERateLimitGuard = SSERateLimitGuard_1 = __decorate([
    (0, common_1.Injectable)()
], SSERateLimitGuard);
//# sourceMappingURL=sse-rate-limit.guard.js.map