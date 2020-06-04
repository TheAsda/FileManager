import { IPanelsManager } from './IPanelsManager';
import { Panel, PanelType } from '../../interfaces/models/Panel';
import { injectable } from 'inversify';
import { find, random, floor } from 'lodash';

@injectable()
class PanelsManager implements IPanelsManager {
  private Panels: Panel[];

  constructor() {
    this.Panels = [];
  }

  getPanelsList(): Panel[] {
    return this.Panels;
  }

  getPanel(id: number): Panel | null {
    return find(this.Panels, ['id', id]) ?? null;
  }

  addNewPanel(type: PanelType): Panel {
    const newId = floor(random(0, Number.MAX_SAFE_INTEGER));
    const newPanel: Panel = { id: newId, type };
    this.Panels.push(newPanel);
    return newPanel;
  }
}

export { PanelsManager };
