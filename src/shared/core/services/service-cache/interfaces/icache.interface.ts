export interface ICacheService {
  set<T>(key: string, value: T, ttl?: number): void;
  get<T>(key: string): T | undefined;
}
