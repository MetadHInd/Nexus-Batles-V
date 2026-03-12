import { ICacheableConstructor } from '../interfaces/cacheable-constructor.interface';
export declare class CacheableFactory {
    static create<T>(raw: Record<string, any>, Model: ICacheableConstructor<T>): T;
    static createMany<T>(rawList: Record<string, any>[], Model: ICacheableConstructor<T>): T[];
}
