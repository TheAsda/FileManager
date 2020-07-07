import { Layout } from 'common/interfaces';

const DEFAULT_LAYOUT: Layout = {
  explorers: {
    hidden: false,
    panels: [
      {
        type: 'explorer',
      },
      {
        type: 'explorer',
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
      },
    ],
  },
};

export { DEFAULT_LAYOUT };
