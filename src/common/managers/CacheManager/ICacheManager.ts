interface ICacheManager {
  addToCache(path: string): Promise<void>;

  cache: string[];

  save(): Promise<void>;
}

export { ICacheManager };
