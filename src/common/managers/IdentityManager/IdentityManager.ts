import { injectable } from 'inversify';
import { IIdentityManager } from './IIdentityManager';

@injectable()
abstract class IdentityManager implements IIdentityManager {
  private id: number;

  constructor() {
    this.id = this.getRandomId();
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }
}

export { IdentityManager };
