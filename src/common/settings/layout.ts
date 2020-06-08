import { Layout, PanelType } from 'common/interfaces';

const DEFAULT_LAYOUT: Layout = {
  xLength: 2,
  yLength: 2,
  panels: [
    {
      type: PanelType.explorer,
      start: {
        x: 0,
        y: 0,
      },
      span: {
        x: 1,
        y: 2,
      },
    },
    {
      type: PanelType.terminal,
      start: {
        x: 1,
        y: 0,
      },
      span: {
        x: 1,
        y: 2,
      },
    },
  ],
};

export { DEFAULT_LAYOUT };
