import { Panel, PanelType, Layout, Coords } from '@fm/common';

interface IPanelsManager {
  getPanelsList(): Panel[];

  getPanel(id: number): Panel | null;

  addNewPanel(type: PanelType, start: Coords, span: Coords): Panel;

  getLayout(): Layout;
}

export { IPanelsManager };
