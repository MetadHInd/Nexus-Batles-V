"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHasher = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptHasher {
    constructor() {
        this.saltRounds = 12;
    }
    async hash(password) {
        return await bcrypt_1.default.hash(password, this.saltRounds);
    }
    async compare(password, hash) {
        return await bcrypt_1.default.compare(password, hash);
    }
}
exports.BcryptHasher = BcryptHasher;
//# sourceMappingURL=BcrypHasher.js.map