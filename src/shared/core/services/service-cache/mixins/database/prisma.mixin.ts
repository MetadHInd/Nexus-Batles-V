import { PrismaService } from '../../../../../database/prisma.service';

export interface IWithPrisma {
  readonly Prisma: PrismaService;
}

type Constructor<T = object> = new (...args: any[]) => T;

export function WithPrisma<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    public readonly _prismaService: PrismaService = new PrismaService();

    get Prisma(): PrismaService {
      return this._prismaService;
    }
  };
}

export { PrismaService };
