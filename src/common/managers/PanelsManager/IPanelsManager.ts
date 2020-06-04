import { Panel, PanelType } from '@fm/common';

interface IPanelsManager {
  getPanelsList(): Panel[];

  getPanel(id: number): Panel | null;

  addNewPanel(type: PanelType): Panel;
}

export { IPanelsManager };
