import { Commands } from '../modals';
import { IIdentityManager } from '@fm/common';

interface HOHandlers {
  commands?: Commands;
  hotkeys?: Commands;
  manager?: IIdentityManager;
}

export { HOHandlers };
