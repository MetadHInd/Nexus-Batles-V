"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const DomainError_1 = require("../../../domain/errors/DomainError");
const bcrypt_1 = require("bcrypt");
class LoginUseCase {
    playerRepository;
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }
    async execute(input) {
        const player = await this.playerRepository.findByEmail(input.email);
        if (!player)
            throw new DomainError_1.DomainError('Credenciales invalidas', 'UNAUTHORIZED');
        const valid = await bcrypt_1.default.compare(input.password, player.passwordHash);
        if (!valid)
            throw new DomainError_1.DomainError('Credenciales invalidas', 'UNAUTHORIZED');
        return player;
    }
}
exports.LoginUseCase = LoginUseCase;
//# sourceMappingURL=LoginUseCase.js.map