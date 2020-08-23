import { Layout, TerminalPanelInfo } from 'common/interfaces/Layout';
import { ApplicationStore } from './interfaces';
import { TerminalManager, ExplorerPanelInfo, Settings } from '@fm/common';
import { log } from 'electron-log';

function mapLayout(store: ApplicationStore): Layout;
function mapLayout(store: ApplicationStore, layout: Layout): ApplicationStore;
function mapLayout(store: ApplicationStore, layout?: Layout): Layout | ApplicationStore {
  if (layout) {
    store.window.height = layout.window.height;
    store.window.width = layout.window.width;

    store.window.sections.explorer.width = layout.explorers.size;
    store.explorers.hidden = layout.explorers.hidden;
    if (layout.explorers.panels[0]) {
      store.explorers.panel0 = {
        height: layout.explorers.panels[0].size,
        state: {
          path: layout.explorers.panels[0].directory,
        },
      };
    }
    if (layout.explorers.panels[1]) {
      store.explorers.panel1 = {
        height: layout.explorers.panels[1].size,
        state: {
          path: layout.explorers.panels[1].directory,
        },
      };
    }

    store.window.sections.preview.width = layout.preview.size;
    store.preview.hidden = layout.preview.hidden;

    store.window.sections.terminal.width = layout.terminals.size;
    store.explorers.hidden = layout.terminals.hidden;
    if (layout.terminals.panels[0]) {
      store.terminals.panel0 = {
        height: layout.terminals.panels[0].size,
        manager: new TerminalManager(),
      };
      store.terminals.panel0.manager.changeDirectory(layout.terminals.panels[0].directory);
    }
    if (layout.terminals.panels[1]) {
      store.terminals.panel1 = {
        height: layout.terminals.panels[1].size,
        manager: new TerminalManager(),
      };
      store.terminals.panel1.manager.changeDirectory(layout.terminals.panels[1].directory);
    }

    return store;
  }

  const explorers: ExplorerPanelInfo[] = [];

  if (store.explorers.panel0) {
    explorers.push({
      directory: store.explorers.panel0.state.path,
      size: store.explorers.panel0.height,
    });
  }

  if (store.explorers.panel1) {
    explorers.push({
      directory: store.explorers.panel1.state.path,
      size: store.explorers.panel1.height,
    });
  }

  const terminals: TerminalPanelInfo[] = [];

  if (store.terminals.panel0) {
    terminals.push({
      directory: store.terminals.panel0.manager.getDirectory(),
      size: store.terminals.panel0.height,
    });
  }

  if (store.terminals.panel1) {
    terminals.push({
      directory: store.terminals.panel1.manager.getDirectory(),
      size: store.terminals.panel1.height,
    });
  }

  const result: Layout = {
    window: {
      height: store.window.height,
      width: store.window.width,
    },
    explorers: {
      hidden: store.explorers.hidden,
      size: store.window.sections.explorer.width,
      panels: explorers,
    },
    preview: {
      hidden: store.preview.hidden,
      size: store.window.sections.preview.width,
    },
    terminals: {
      hidden: store.terminals.hidden,
      size: store.window.sections.terminal.width,
      panels: terminals,
    },
  };

  return result;
}

function mapSettings(store: ApplicationStore): Settings;
function mapSettings(store: ApplicationStore, settings: Settings): ApplicationStore;
function mapSettings(store: ApplicationStore, settings?: Settings): Settings | ApplicationStore {
  log('settings', settings);
  if (settings) {
    store.settings.autoPreview = settings.autoPreview;
    store.settings.theme = settings.theme;
    store.settings.showHidden = settings.showHidden;

    return store;
  }

  const result: Settings = {
    autoPreview: store.settings.autoPreview,
    showHidden: store.settings.showHidden,
    theme: store.settings.theme,
  };

  return result;
}

export { mapLayout, mapSettings };
