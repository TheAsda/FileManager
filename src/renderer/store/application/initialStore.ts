import { TerminalManager } from '@fm/common';
import { ApplicationStore } from './interfaces';

const initialStore: ApplicationStore = {
  settings: {
    autoPreview: true,
    showHidden: false,
    theme: 'default',
  },
  window: {
    height: 800,
    width: 600,
    sections: {
      explorer: {
        width: 200,
      },
      preview: {
        width: 200,
      },
      terminal: {
        width: 200,
      },
    },
  },
  explorers: {
    hidden: false,
    panel0: {
      state: {
        path: process.cwd(),
      },
      height: 800,
    },
  },
  preview: {
    hidden: false,
  },
  terminals: {
    hidden: false,
    panel0: {
      manager: new TerminalManager(),
      height: 800,
    },
  },
};

export { initialStore };
