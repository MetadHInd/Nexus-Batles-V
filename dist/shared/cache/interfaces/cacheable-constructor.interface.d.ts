export interface ICacheableConstructor<T> {
    fromJSON(json: Record<string, any>): T;
}
