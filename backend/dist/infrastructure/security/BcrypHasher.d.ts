import { IPasswordHasher } from '../../application/usecases/auth/RegisterUser';
export declare class BcryptHasher implements IPasswordHasher {
    private readonly saltRounds;
    constructor();
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}
//# sourceMappingURL=BcrypHasher.d.ts.map