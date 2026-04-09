/**
 * UserRepositoryMysql.ts — Infrastructure / Persistence / Repositories
 * FIX: eliminado import de getConnection (no existe en connection.ts).
 *      Reemplazado por pool directamente.
 */
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
export declare class UserRepositoryMySQL implements IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findByApodo(apodo: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    private mapToDomain;
}
//# sourceMappingURL=UserRepositoryMysql.d.ts.map