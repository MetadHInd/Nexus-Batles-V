export interface ICacheable {
  cacheKey(): string;
  cacheTTL?(): number;
  toJSON(): Record<string, any>;
}
