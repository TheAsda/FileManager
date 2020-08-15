import React from 'react';
import { createStore, createEvent } from 'effector';
import { useStore } from 'effector-react';
import { ITerminalManager, IExplorerManager, ExplorerManager, TerminalManager } from '@fm/common';

interface ExplorersStore {
  height: number;
  manager: IExplorerManager;
}

interface TerminalStore {
  height: number;
  manager: ITerminalManager;
}

interface ApplicationStore {
  window: {
    width: number;
    height: number;
    sections: {
      explorer: { width: number };
      preview: { width: number };
      terminal: { width: number };
    };
  };
  explorers: {
    hidden: boolean;
    autoPreview: boolean;
    showHidden: boolean;
    panel0?: ExplorersStore;
    panel1?: ExplorersStore;
  };
  terminals: {
    hidden: boolean;
    panel0?: TerminalStore;
    panel1?: TerminalStore;
  };
  preview: {
    hidden: boolean;
    path?: string;
  };
}

const store = createStore<ApplicationStore>({
  window: {
    height: 800,
    width: 600,
    sections: {
      explorer: {
        width: 200,
      },
      preview: {
        width: 200,
      },
      terminal: {
        width: 200,
      },
    },
  },
  explorers: {
    hidden: false,
    autoPreview: true,
    showHidden: false,
    panel0: {
      manager: new ExplorerManager(),
      height: 800,
    },
  },
  preview: {
    hidden: true,
  },
  terminals: {
    hidden: false,
    panel0: {
      manager: new TerminalManager(),
      height: 800,
    },
  },
});

const setWindowSize = createEvent<{ width: number; height: number }>();
store.on(setWindowSize, (state, value) => {
  state.window.height = value.height;
  state.window.width = value.width;

  return state;
});

const setSectionsSize = createEvent<{
  explorer: { width: number };
  preview: { width: number };
  terminal: { width: number };
}>();
store.on(setSectionsSize, (state, value) => {
  state.window.sections.explorer = value.explorer;
  state.window.sections.preview = value.preview;
  state.window.sections.terminal = value.terminal;

  return state;
});

const toggleExplorers = createEvent<void>();
store.on(toggleExplorers, (state) => {
  state.explorers.hidden = !state.explorers.hidden;

  return state;
});

const toggleAutoPreview = createEvent<void>();
store.on(toggleAutoPreview, (state) => {
  state.explorers.autoPreview = !state.explorers.autoPreview;

  return state;
});

const toggleShowHidden = createEvent<void>();
store.on(toggleShowHidden, (state) => {
  state.explorers.showHidden = !state.explorers.showHidden;

  return state;
});

const openExplorer = createEvent<{
  path?: string;
}>();
store.on(openExplorer, (state, value) => {
  if (!state.explorers.panel0) {
    state.explorers.panel0 = {
      height: 200,
      manager: new ExplorerManager(),
    };

    if (value.path) {
      state.explorers.panel0.manager.setPath(value.path);
    }

    return state;
  }
  if (!state.explorers.panel1) {
    state.explorers.panel1 = {
      height: 200,
      manager: new ExplorerManager(),
    };

    if (value.path) {
      state.explorers.panel1.manager.setPath(value.path);
    }

    return state;
  }

  console.warn('Cannot open explorer');
});

const closeExplorer = createEvent<0 | 1>();
store.on(closeExplorer, (state, value) => {
  if (value === 1 && state.explorers.panel1) {
    state.explorers.panel1 = undefined;

    return state;
  }
  if (value === 0 && state.explorers.panel0) {
    state.explorers.panel0 = undefined;

    return state;
  }

  console.warn(`Incorrect index: ${value}`);
});

const setExplorerSize = createEvent<{
  height: number;
  index: 0 | 1;
}>();
store.on(setExplorerSize, (state, value) => {
  if (value.index === 1 && state.explorers.panel1) {
    state.explorers.panel1.height = value.height;

    return state;
  }
  if (value.index === 0 && state.explorers.panel0) {
    state.explorers.panel0.height = value.height;

    return state;
  }

  console.warn(`Incorrect index: ${value.index}`);
});

const openTerminal = createEvent<{
  path?: string;
}>();
store.on(openTerminal, (state, value) => {
  if (!state.terminals.panel0) {
    state.terminals.panel0 = {
      height: 200,
      manager: new TerminalManager(),
    };

    if (value.path) {
      state.terminals.panel0.manager.changeDirectory(value.path);
    }

    return state;
  }
  if (!state.terminals.panel1) {
    state.terminals.panel1 = {
      height: 200,
      manager: new TerminalManager(),
    };

    if (value.path) {
      state.terminals.panel1.manager.changeDirectory(value.path);
    }

    return state;
  }

  console.warn('Cannot open terminal');
});

const closeTerminal = createEvent<0 | 1>();
store.on(closeTerminal, (state, value) => {
  if (value === 1 && state.terminals.panel1) {
    state.terminals.panel1 = undefined;

    return state;
  }
  if (value === 0 && state.terminals.panel0) {
    state.terminals.panel0 = undefined;

    return state;
  }

  console.warn(`Incorrect index: ${value}`);
});

const setTerminalSize = createEvent<{
  height: number;
  index: 0 | 1;
}>();
store.on(setTerminalSize, (state, value) => {
  if (value.index === 1 && state.terminals.panel1) {
    state.terminals.panel1.height = value.height;

    return state;
  }
  if (value.index === 0 && state.terminals.panel0) {
    state.terminals.panel0.height = value.height;

    return state;
  }

  console.warn(`Incorrect index: ${value.index}`);
});

const togglePreview = createEvent<void>();
store.on(togglePreview, (state) => {
  state.preview.hidden = !state.preview.hidden;

  return state;
});

export {
  store,
  setWindowSize,
  setSectionsSize,
  toggleExplorers,
  toggleAutoPreview,
  toggleShowHidden,
  openExplorer,
  closeExplorer,
  setExplorerSize,
  openTerminal,
  closeTerminal,
  setTerminalSize,
  togglePreview,
};
