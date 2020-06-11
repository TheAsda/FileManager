import { Settings } from 'common/interfaces';

const DEFAULT_SETTINGS: Settings = {
  logLevel: 'info',
  terminal: {
    fontFamily: 'Consolas',
    fontSize: 15,
  },
  theme: 'light',
  panelsGridSize: {
    xLength: 3,
    yLength: 2,
  },
};

export { DEFAULT_SETTINGS };
