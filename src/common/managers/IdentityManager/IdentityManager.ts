import { injectable } from 'inversify';
import { IIdentityManager } from './IIdentityManager';

@injectable()
abstract class IdentityManager implements IIdentityManager {
  private id: number | null;

  constructor() {
    this.id = null;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getId(): number | null {
    return this.id;
  }
}

export { IdentityManager };
