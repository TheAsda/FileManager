enum PanelType {
  explorer,
  terminal,
  preview,
}

interface PanelBase {
  id: number;
}

interface ExplorerPanel extends PanelBase {
  type: PanelType.explorer;
  initialDirectory?: string;
}

interface TerminalPanel extends PanelBase {
  type: PanelType.terminal;
  initialDirectory?: string;
}

interface PreviewPanel extends PanelBase {
  type: PanelType.preview;
}

type Panel = ExplorerPanel | TerminalPanel | PreviewPanel;

export { PanelType, Panel, ExplorerPanel, TerminalPanel };
