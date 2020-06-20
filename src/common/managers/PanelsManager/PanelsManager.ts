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
import { compact, find, floor, random, reject } from 'lodash';

@injectable()
class PanelsManager implements IPanelsManager {
  private Layout: Layout;

  constructor() {
    // TODO: change to default layout loading
    const layout: Layout = {
      explorers: {
        hidden: false,
        panels: [PanelsManager.createPanel('explorer') as ExplorerPanel],
      },
      preview: {
        hidden: false,
        panel: PanelsManager.createPanel('preview') as PreviewPanel,
      },
      terminals: {
        hidden: false,
        panels: [PanelsManager.createPanel('terminal') as TerminalPanel],
      },
    };

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
  registerNewPanel(type: PanelType): number {
    let newPanel: Panel;
    switch (type) {
      case 'explorer':
        if (!this.checkPanel('explorer')) {
          throw new Error('Error while explorer registration');
        }

        newPanel = PanelsManager.createPanel(type) as ExplorerPanel;

        this.Layout.explorers.panels.push(newPanel);
        break;
      case 'terminal':
        if (!this.checkPanel('terminal')) {
          throw new Error('Error while terminal registration');
        }

        newPanel = PanelsManager.createPanel(type) as TerminalPanel;

        this.Layout.terminals.panels.push(newPanel);
        break;
      case 'preview':
        if (!this.checkPanel('preview')) {
          throw new Error('Error while preview registration: preview panel already registered');
        }
        newPanel = PanelsManager.createPanel(type) as PreviewPanel;

        this.Layout.preview.panel = newPanel;
    }

    return newPanel.id;
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

  getLayout(): Layout {
    return this.Layout;
  }

  checkPanel(type: PanelType): boolean {
    switch (type) {
      case 'explorer':
        if (this.Layout.explorers.panels.length < 2) {
          return true;
        }
        return false;

      case 'preview':
        if (this.Layout.preview.panel === undefined) {
          return true;
        }
        return false;

      case 'terminal':
        if (this.Layout.terminals.panels.length < 2) {
          return true;
        }
        return false;
    }
  }
}

export { PanelsManager };
