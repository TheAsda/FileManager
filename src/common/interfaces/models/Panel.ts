type PanelType = 'explorer' | 'terminal' | 'preview';

interface PanelBase {
  id: number;
}

interface PanelInfoBase {
  type: PanelType;
}

interface ExplorerPanelInfo extends PanelInfoBase {
  type: 'explorer';
  initialDirectory?: string;
}

interface ExplorerPanel extends ExplorerPanelInfo, PanelBase {}

interface TerminalPanelInfo extends PanelInfoBase {
  type: 'terminal';
  initialDirectory?: string;
}

interface TerminalPanel extends TerminalPanelInfo, PanelBase {}

interface PreviewPanelInfo extends PanelInfoBase {
  type: 'preview';
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
};
