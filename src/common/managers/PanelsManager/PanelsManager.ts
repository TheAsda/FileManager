import { IPanelsManager } from './IPanelsManager';
import {
  ExplorerPanel,
  Layout,
  Panel,
  PanelType,
  PreviewPanel,
  TerminalPanel,
} from '../../interfaces/models/';
import { injectable } from 'inversify';
import { cloneDeep, compact, find, floor, random, reject, times } from 'lodash';
import { DEFAULT_LAYOUT } from '@fm/common';

@injectable()
class PanelsManager implements IPanelsManager {
  private Layout: Layout;

  constructor() {
    const layout = cloneDeep(DEFAULT_LAYOUT);
    if (layout.explorers.hidden === false) {
      layout.explorers.panels = times(
        layout.explorers.count,
        () => PanelsManager.createPanel('explorer') as ExplorerPanel
      );
    }
    if (layout.terminals.hidden === false) {
      layout.terminals.panels = times(
        layout.terminals.count,
        () => PanelsManager.createPanel('terminal') as TerminalPanel
      );
    }
    if (layout.preview.hidden === false) {
      layout.preview.panel = PanelsManager.createPanel('preview') as PreviewPanel;
    }
    this.Layout = layout;
  }

  private get panels(): Panel[] {
    return compact([
      ...this.Layout.explorers.panels,
      ...this.Layout.terminals.panels,
      this.Layout.preview.panel,
    ]);
  }

  /**
   * Returns random integer number
   */
  private static getRandomId(): number {
    return floor(random(0, Number.MAX_SAFE_INTEGER));
  }

  /** @inheritdoc */
  getPanel(id: number): Panel | null {
    return find(this.panels, ['id', id]) ?? null;
  }

  /** @inheritdoc */
  registerNewPanel(type: PanelType, initialDirectory?: string): Panel {
    let newPanel: Panel;
    switch (type) {
      case 'explorer':
        if (
          this.Layout.explorers.count !== this.Layout.explorers.panels.length &&
          this.Layout.explorers.count > 2
        ) {
          throw new Error('Error while explorer registration');
        }

        newPanel = PanelsManager.createPanel(type, initialDirectory) as ExplorerPanel;

        this.Layout.explorers.panels.push(newPanel);
        this.Layout.explorers.count++;
        break;
      case 'terminal':
        if (
          this.Layout.terminals.count !== this.Layout.terminals.panels.length &&
          this.Layout.terminals.count > 2
        ) {
          throw new Error('Error while terminal registration');
        }

        newPanel = PanelsManager.createPanel(type, initialDirectory) as TerminalPanel;

        this.Layout.terminals.panels.push(newPanel);
        this.Layout.terminals.count++;
        break;
      case 'preview':
        if (this.Layout.preview.panel !== undefined) {
          throw new Error('Error while preview registration: preview panel already registered');
        }
        newPanel = PanelsManager.createPanel(type) as PreviewPanel;

        this.Layout.preview.panel = newPanel;
    }

    return newPanel;
  }

  /** @inheritdoc */
  unregisterPanel(id: number): boolean {
    if (find(this.Layout.explorers.panels, ['id', id])) {
      this.Layout.explorers.panels = reject(this.Layout.explorers.panels, ['id', id]);
      return true;
    }
    if (find(this.Layout.terminals.panels, ['id', id])) {
      this.Layout.terminals.panels = reject(this.Layout.terminals.panels, ['id', id]);
      return true;
    }
    if (this.Layout.preview.panel?.id === id) {
      this.Layout.preview.panel = undefined;
      return true;
    }
    return false;
  }

  /** @inheritdoc */
  get layout(): Layout {
    return this.Layout;
  }

  private static createPanel(type: PanelType, initialDirectory?: string): Panel {
    let newPanel: Panel;
    switch (type) {
      case 'explorer':
        newPanel = {
          id: this.getRandomId(),
          type: 'explorer',
          initialDirectory: initialDirectory,
        };
        break;
      case 'terminal':
        newPanel = { id: this.getRandomId(), type: 'terminal', initialDirectory: initialDirectory };
        break;
      case 'preview':
        newPanel = { id: this.getRandomId(), type: 'preview' };
    }
    return newPanel;
  }
}

export { PanelsManager };
