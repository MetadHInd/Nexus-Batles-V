"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateMissionUseCase = void 0;
const DomainError_1 = require("../../../domain/errors/DomainError");
class GenerateMissionUseCase {
    constructor(missionRepository, playerRepository, aiGateway) {
        this.missionRepository = missionRepository;
        this.playerRepository = playerRepository;
        this.aiGateway = aiGateway;
    }
    async execute(playerId) {
        const player = await this.playerRepository.findById(playerId);
        if (!player)
            throw new DomainError_1.NotFoundError('Jugador');
        const activeMissions = await this.missionRepository.findActiveByPlayer(playerId);
        const missionData = await this.aiGateway.generateMission({
            playerId,
            rank: player.rank,
            completedMissions: activeMissions.length,
        });
        return this.missionRepository.save({
            ...missionData,
            playerId,
            status: 'ACTIVE',
            aiModel: 'nexus-ai-v1',
        });
    }
}
exports.GenerateMissionUseCase = GenerateMissionUseCase;
//# sourceMappingURL=GenerateMissionUseCase.js.map