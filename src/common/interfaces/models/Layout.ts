import { ExplorerPanel, PreviewPanel, TerminalPanel } from './Panel';

interface Layout {
  explorers: {
    count: 1 | 2;
    hidden: boolean;
    panels: ExplorerPanel[];
  };
  preview: {
    hidden: boolean;
    panel?: PreviewPanel;
  };
  terminals: {
    hidden: boolean;
    count: 1 | 2;
    panels: TerminalPanel[];
  };
}

export { Layout };
