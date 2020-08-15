import { useState, useEffect } from 'react';
import { createStore, createEvent } from 'effector';
import {
  ITerminalManager,
  IExplorerManager,
  ExplorerManager,
  TerminalManager,
  FileInfo,
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

export { store, setWindowSize, setSectionsSize, ApplicationStore, useStoreState };
