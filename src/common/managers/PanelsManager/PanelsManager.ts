import { IPanelsManager } from './IPanelsManager';
import { Panel, PanelType, PanelInfo, Coords, Layout } from '../../interfaces/models/';
import { injectable } from 'inversify';
import { find, random, floor, map } from 'lodash';
import { DEFAULT_LAYOUT } from '@fm/common';

@injectable()
class PanelsManager implements IPanelsManager {
  private Panels: Panel[];
  private Layout: Layout;

  constructor() {
    this.Layout = DEFAULT_LAYOUT;
    this.Panels = map<PanelInfo, Panel>(DEFAULT_LAYOUT.panels, (item) => ({
      ...item,
      id: this.getRandomId(),
    }));
  }

  private getRandomId(): number {
    return floor(random(0, Number.MAX_SAFE_INTEGER));
  }

  getPanelsList(): Panel[] {
    return this.Panels;
  }

  getPanel(id: number): Panel | null {
    return find(this.Panels, ['id', id]) ?? null;
  }

  addNewPanel(type: PanelType, start: Coords, span: Coords): Panel {
    const newPanel: Panel = { id: this.getRandomId(), type, start, span };
    this.Panels.push(newPanel);
    return newPanel;
  }

  getLayout(): Layout {
    return this.Layout;
  }
}

export { PanelsManager };
