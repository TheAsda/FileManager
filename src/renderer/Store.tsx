import React, { useState, useEffect } from 'react';
import { createStore, createEvent } from 'effector';
import { useStore } from 'effector-react';
import {
  ITerminalManager,
  IExplorerManager,
  ExplorerManager,
  TerminalManager,
  FileInfo,
  Settings,
} from '@fm/common';
import { isEqual, clone } from 'lodash';

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
    item?: FileInfo;
  };
}

const initialState = {
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
};

const store = createStore<ApplicationStore>(initialState);

const setWindowSize = createEvent<{ width: number; height: number }>();
store.on(setWindowSize, (state, value) => {
  state.window.height = value.height;
  state.window.width = value.width;

  return clone(state);
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

  console.log('state', state);
  return clone(state);
});

const toggleExplorers = createEvent<void>();
store.on(toggleExplorers, (state) => {
  state.explorers.hidden = !state.explorers.hidden;

  return clone(state);
});

const toggleAutoPreview = createEvent<void>();
store.on(toggleAutoPreview, (state) => {
  state.explorers.autoPreview = !state.explorers.autoPreview;

  return clone(state);
});

const toggleShowHidden = createEvent<void>();
store.on(toggleShowHidden, (state) => {
  state.explorers.showHidden = !state.explorers.showHidden;

  return clone(state);
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

    return clone(state);
  }
  if (!state.explorers.panel1) {
    state.explorers.panel1 = {
      height: 200,
      manager: new ExplorerManager(),
    };

    if (value.path) {
      state.explorers.panel1.manager.setPath(value.path);
    }

    return clone(state);
  }

  console.warn('Cannot open explorer', state);
});

const closeExplorer = createEvent<number>();
store.on(closeExplorer, (state, value) => {
  if (value === 1 && state.explorers.panel1) {
    state.explorers.panel1 = undefined;

    return clone(state);
  }
  if (value === 0 && state.explorers.panel0) {
    state.explorers.panel0 = undefined;

    return clone(state);
  }

  console.warn(`Incorrect index: ${value}`);
});

const setExplorerSize = createEvent<{
  height: number;
  index: number;
}>();
store.on(setExplorerSize, (state, value) => {
  if (value.index === 1 && state.explorers.panel1) {
    state.explorers.panel1.height = value.height;

    return clone(state);
  }
  if (value.index === 0 && state.explorers.panel0) {
    state.explorers.panel0.height = value.height;

    return clone(state);
  }

  console.warn(`Incorrect index: ${value.index}`);
});

const changeExplorerDirectory = createEvent<{
  path: string;
  index: number;
}>();
store.on(changeExplorerDirectory, (state, value) => {
  if (value.index === 1 && state.explorers.panel1) {
    state.explorers.panel1.manager.setPath(value.path);

    return clone(state);
  }
  if (value.index === 0 && state.explorers.panel0) {
    state.explorers.panel0.manager.setPath(value.path);

    return clone(state);
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

    return clone(state);
  }
  if (!state.terminals.panel1) {
    state.terminals.panel1 = {
      height: 200,
      manager: new TerminalManager(),
    };

    if (value.path) {
      state.terminals.panel1.manager.changeDirectory(value.path);
    }

    return clone(state);
  }

  console.warn('Cannot open terminal', state);
});

const closeTerminal = createEvent<number>();
store.on(closeTerminal, (state, value) => {
  if (value === 1 && state.terminals.panel1) {
    state.terminals.panel1 = undefined;

    return clone(state);
  }
  if (value === 0 && state.terminals.panel0) {
    state.terminals.panel0 = undefined;

    return clone(state);
  }

  console.warn(`Incorrect index: ${value}`);
});

const setTerminalSize = createEvent<{
  height: number;
  index: number;
}>();
store.on(setTerminalSize, (state, value) => {
  if (value.index === 1 && state.terminals.panel1) {
    state.terminals.panel1.height = value.height;

    return clone(state);
  }
  if (value.index === 0 && state.terminals.panel0) {
    state.terminals.panel0.height = value.height;

    return clone(state);
  }

  console.warn(`Incorrect index: ${value.index}`);
});

const changeTerminalDirectory = createEvent<{
  path: string;
  index: number;
}>();
store.on(changeTerminalDirectory, (state, value) => {
  if (value.index === 1 && state.terminals.panel1) {
    state.terminals.panel1.manager.changeDirectory(value.path);

    return clone(state);
  }
  if (value.index === 0 && state.terminals.panel0) {
    state.terminals.panel0.manager.changeDirectory(value.path);

    return clone(state);
  }

  console.warn(`Incorrect index: ${value.index}`);
});

const togglePreview = createEvent<void>();
store.on(togglePreview, (state) => {
  state.preview.hidden = !state.preview.hidden;

  return clone(state);
});

const setPreviewItem = createEvent<FileInfo>();
store.on(setPreviewItem, (state, value) => {
  state.preview.item = value;

  return clone(state);
});

const useStoreState = () => {
  const [state, setState] = useState<ApplicationStore>(initialState);

  useEffect(
    () =>
      store.watch((newState) => {
        if (!isEqual(state, newState)) {
          console.log(newState);
        }
        setState(newState);
      }),
    []
  );

  return clone(state);
};

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
  changeExplorerDirectory,
  changeTerminalDirectory,
  setPreviewItem,
  ApplicationStore,
  useStoreState,
};
