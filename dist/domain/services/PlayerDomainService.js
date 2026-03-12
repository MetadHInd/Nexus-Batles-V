"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDomainService = void 0;
const DomainError_1 = require("../errors/DomainError");
class PlayerDomainService {
    validateSufficientCoins(player, required) {
        if (player.coins < required) {
            throw new DomainError_1.ValidationError(`Saldo insuficiente. Disponible: ${player.coins}, requerido: ${required}`);
        }
    }
    calculateNewRank(currentRank, coinsEarned) {
        return Math.floor(currentRank + coinsEarned / 100);
    }
}
exports.PlayerDomainService = PlayerDomainService;
//# sourceMappingURL=PlayerDomainService.js.map