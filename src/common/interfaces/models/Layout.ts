import { ExplorerPanelInfo, PreviewPanelInfo, TerminalPanelInfo } from './Panel';

interface Layout {
  explorers: {
    hidden: boolean;
    panels: ExplorerPanelInfo[];
  };
  preview: {
    hidden: boolean;
    panel?: PreviewPanelInfo;
  };
  terminals: {
    hidden: boolean;
    panels: TerminalPanelInfo[];
  };
}

export { Layout };
