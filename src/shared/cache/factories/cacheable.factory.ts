import { ICacheableConstructor } from '../interfaces/cacheable-constructor.interface';

export class CacheableFactory {
  static create<T>(
    raw: Record<string, any>,
    Model: ICacheableConstructor<T>,
  ): T {
    return Model.fromJSON(raw);
  }

  static createMany<T>(
    rawList: Record<string, any>[],
    Model: ICacheableConstructor<T>,
  ): T[] {
    return rawList.map((item) => Model.fromJSON(item));
  }
}
