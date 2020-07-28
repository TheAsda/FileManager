import { Settings } from 'common/interfaces';
import { DEFAULT_LAYOUT } from './layout';

const DEFAULT_SETTINGS: Settings = {
  logLevel: 'info',
  theme: 'light',
  autoPreview: true,
  layout: DEFAULT_LAYOUT,
  showHidden: false,
};

export { DEFAULT_SETTINGS };
