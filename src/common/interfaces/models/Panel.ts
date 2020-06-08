enum PanelType {
  explorer,
  terminal,
  preview,
}

interface Coords {
  x: number;
  y: number;
}

interface PanelPosition {
  start: Coords;
  span: Coords;
}

interface PanelBase {
  id: number;
}

interface ExplorerPanelInfo extends PanelPosition {
  type: PanelType.explorer;
  initialDirectory?: string;
}

interface ExplorerPanel extends ExplorerPanelInfo, PanelBase {}

interface TerminalPanelInfo extends PanelPosition {
  type: PanelType.terminal;
  initialDirectory?: string;
}

interface TerminalPanel extends TerminalPanelInfo, PanelBase {}

interface PreviewPanelInfo extends PanelPosition {
  type: PanelType.preview;
}

interface PreviewPanel extends PreviewPanelInfo, PanelBase {}

type PanelInfo = ExplorerPanelInfo | TerminalPanelInfo | PreviewPanelInfo;

type Panel = ExplorerPanel | TerminalPanel | PreviewPanel;

export {
  PanelType,
  Panel,
  ExplorerPanel,
  TerminalPanel,
  PreviewPanel,
  ExplorerPanelInfo,
  PreviewPanelInfo,
  TerminalPanelInfo,
  PanelInfo,
  Coords,
};
