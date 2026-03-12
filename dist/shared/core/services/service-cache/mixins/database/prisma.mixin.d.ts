import { PrismaService } from '../../../../../database/prisma.service';
export interface IWithPrisma {
    readonly Prisma: PrismaService;
}
type Constructor<T = object> = new (...args: any[]) => T;
export declare function WithPrisma<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        readonly _prismaService: PrismaService;
        get Prisma(): PrismaService;
    };
} & TBase;
export { PrismaService };
