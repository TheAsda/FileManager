import { ExplorerPanel, PreviewPanel, TerminalPanel } from './Panel';

interface Layout {
  explorers: {
    hidden: boolean;
    panels: ExplorerPanel[];
  };
  preview: {
    hidden: boolean;
    panel?: PreviewPanel;
  };
  terminals: {
    hidden: boolean;
    panels: TerminalPanel[];
  };
}

export { Layout };
