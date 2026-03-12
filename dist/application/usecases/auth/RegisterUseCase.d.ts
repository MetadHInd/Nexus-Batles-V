import { IPlayerRepository } from '../../../domain/repositories/IPlayerRepository';
export interface RegisterInput {
    username: string;
    email: string;
    password: string;
}
export declare class RegisterUseCase {
    private readonly playerRepository;
    constructor(playerRepository: IPlayerRepository);
    execute(input: RegisterInput): Promise<import("../../../domain/entities/Player").Player>;
}
