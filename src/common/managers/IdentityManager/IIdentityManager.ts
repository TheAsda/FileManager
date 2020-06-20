interface IIdentityManager {
  setId(id: number): void;

  getId(): number | null;
}

export { IIdentityManager };
