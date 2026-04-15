"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
class JwtTokenService {
    generate(payload) {
        const options = {
            expiresIn: env_1.env.JWT_EXPIRES_IN,
        };
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, options);
    }
    generateRefreshToken(payload) {
        const options = {
            expiresIn: env_1.env.JWT_REFRESH_EXPIRES_IN,
        };
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_REFRESH_SECRET, options);
    }
    verify(token) {
        try {
            return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        }
        catch (error) {
            return null;
        }
    }
    verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_SECRET);
        }
        catch (error) {
            return null;
        }
    }
}
exports.JwtTokenService = JwtTokenService;
//# sourceMappingURL=JwtTokenServices.js.map