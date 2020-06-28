import { Layout } from 'common/interfaces';

const DEFAULT_LAYOUT: Layout = {
  explorers: {
    hidden: false,
    panels: [
      {
        type: 'explorer',
        initialDirectory: 'D:/',
      },
      {
        type: 'explorer',
        initialDirectory: 'C:/',
      },
    ],
  },
  preview: {
    hidden: false,
    panel: {
      type: 'preview',
    },
  },
  terminals: {
    hidden: false,
    panels: [
      {
        type: 'terminal',
        initialDirectory: 'D:/',
      },
    ],
  },
};

export { DEFAULT_LAYOUT };
