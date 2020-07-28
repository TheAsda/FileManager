import { ExplorerPanelInfo, PreviewPanelInfo, TerminalPanelInfo } from './Panel';

interface Layout {
  explorers: {
    hidden?: boolean;
    panels: ExplorerPanelInfo[];
    sizes?: number[];
  };
  preview: {
    hidden?: boolean;
    panel?: PreviewPanelInfo;
    size?: number;
  };
  terminals: {
    hidden?: boolean;
    panels: TerminalPanelInfo[];
    sizes?: number[];
  };
}

export { Layout };
