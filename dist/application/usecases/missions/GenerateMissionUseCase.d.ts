import { IMissionRepository } from '../../../domain/repositories/IMissionRepository';
import { IPlayerRepository } from '../../../domain/repositories/IPlayerRepository';
import { IAIGateway } from '../../ports/IAIGateway';
export declare class GenerateMissionUseCase {
    private readonly missionRepository;
    private readonly playerRepository;
    private readonly aiGateway;
    constructor(missionRepository: IMissionRepository, playerRepository: IPlayerRepository, aiGateway: IAIGateway);
    execute(playerId: string): Promise<import("../../../domain/entities/Mission").Mission>;
}
