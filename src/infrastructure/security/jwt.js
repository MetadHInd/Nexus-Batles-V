"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
var jsonwebtoken_1 = require("jsonwebtoken");
var env_1 = require("../../config/env");
function signAccessToken(payload) {
    var options = { expiresIn: env_1.env.JWT_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(__assign(__assign({}, payload), { jti: crypto.randomUUID() }), env_1.env.JWT_SECRET, options);
}
function signRefreshToken(userId) {
    var options = { expiresIn: env_1.env.JWT_REFRESH_EXPIRES_IN };
    return jsonwebtoken_1.default.sign({ sub: userId, jti: crypto.randomUUID() }, env_1.env.JWT_REFRESH_SECRET, options);
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_SECRET);
}
