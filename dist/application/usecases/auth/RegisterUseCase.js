"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const DomainError_1 = require("../../../domain/errors/DomainError");
const bcrypt_1 = require("bcrypt");
class RegisterUseCase {
    playerRepository;
    constructor(playerRepository) {
        this.playerRepository = playerRepository;
    }
    async execute(input) {
        const existingEmail = await this.playerRepository.findByEmail(input.email);
        if (existingEmail)
            throw new DomainError_1.ConflictError('El email ya esta registrado');
        const existingUsername = await this.playerRepository.findByUsername(input.username);
        if (existingUsername)
            throw new DomainError_1.ConflictError('El username ya esta en uso');
        const passwordHash = await bcrypt_1.default.hash(input.password, 12);
        const player = await this.playerRepository.save({
            username: input.username,
            email: input.email,
            passwordHash,
            role: 'PLAYER',
            rank: 0,
            coins: 0,
        });
        return player;
    }
}
exports.RegisterUseCase = RegisterUseCase;
//# sourceMappingURL=RegisterUseCase.js.map