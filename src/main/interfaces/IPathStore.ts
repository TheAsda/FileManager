interface IPathStore {
  getPaths(): string[];

  addToPath(path: string): void;
}

export { IPathStore };
