type PanelType = 'explorer' | 'terminal' | 'preview';

interface PanelBase {
  id: number;
}

interface PanelInfoBase {
  type: PanelType;
}

interface ExplorerPanelInfo extends PanelInfoBase {
  type: 'explorer';
  directory?: string;
}

interface ExplorerPanel extends ExplorerPanelInfo, PanelBase {}

interface TerminalPanelInfo extends PanelInfoBase {
  type: 'terminal';
  directory?: string;
}

interface TerminalPanel extends TerminalPanelInfo, PanelBase {}

interface PreviewPanelInfo extends PanelInfoBase {
  type: 'preview';
  directory?: string;
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
