import { Layout } from 'common/interfaces';

const DEFAULT_LAYOUT: Layout = {
  explorers: {
    hidden: false,
    panels: [
      {
        type: 'explorer',
        directory: 'D:\\YandexDisk\\Всякое\\Фотолаборатория Аяза',
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
