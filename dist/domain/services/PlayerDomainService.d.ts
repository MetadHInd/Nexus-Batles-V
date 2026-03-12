import { Player } from '../entities/Player';
export declare class PlayerDomainService {
    validateSufficientCoins(player: Player, required: number): void;
    calculateNewRank(currentRank: number, coinsEarned: number): number;
}
