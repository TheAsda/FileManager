interface ExplorerPanelInfo {
  directory: string;
  size: number;
}

interface TerminalPanelInfo {
  directory: string;
  size: number;
}

interface Layout {
  explorers: {
    hidden: boolean;
    panels: ExplorerPanelInfo[];
    size: number;
  };
  preview: {
    hidden: boolean;
    size: number;
  };
  terminals: {
    hidden: boolean;
    panels: TerminalPanelInfo[];
    size: number;
  };
  window: {
    width: number;
    height: number;
  };
}

export { Layout, ExplorerPanelInfo, TerminalPanelInfo };
