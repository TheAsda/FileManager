import { Commands } from '../modals';
import { IIdentityManager } from 'common/managers/IdentityManager';

interface HOHandlers {
  commands?: Commands;
  hotkeys?: Commands;
  manager?: IIdentityManager;
}

export { HOHandlers };
