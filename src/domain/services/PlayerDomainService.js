"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDomainService = void 0;
var DomainError_1 = require("../errors/DomainError");
var PlayerDomainService = /** @class */ (function () {
    function PlayerDomainService() {
    }
    PlayerDomainService.prototype.validateSufficientCoins = function (player, required) {
        if (player.coins < required) {
            throw new DomainError_1.ValidationError("Saldo insuficiente. Disponible: ".concat(player.coins, ", requerido: ").concat(required));
        }
    };
    PlayerDomainService.prototype.calculateNewRank = function (currentRank, coinsEarned) {
        // Logica de ranking — ajustar segun reglas del juego
        return Math.floor(currentRank + coinsEarned / 100);
    };
    return PlayerDomainService;
}());
exports.PlayerDomainService = PlayerDomainService;
