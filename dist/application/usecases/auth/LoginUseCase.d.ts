import { IPlayerRepository } from '../../../domain/repositories/IPlayerRepository';
export interface LoginInput {
    email: string;
    password: string;
}
export declare class LoginUseCase {
    private readonly playerRepository;
    constructor(playerRepository: IPlayerRepository);
    execute(input: LoginInput): Promise<import("../../../domain/entities/Player").Player>;
}
