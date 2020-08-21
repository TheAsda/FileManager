import { createApi } from 'effector';
import { store } from '../store';
import { clone } from 'lodash';

const explorerApi = createApi(store, {
  toggleExplorers: (state) => {
    state.explorers.hidden = !state.explorers.hidden;

    return clone(state);
  },
  toggleAutoPreview: (state) => {
    state.explorers.autoPreview = !state.explorers.autoPreview;

    return clone(state);
  },
  toggleShowHidden: (state) => {
    state.explorers.showHidden = !state.explorers.showHidden;

    return clone(state);
  },
  openExplorer: (
    state,
    value: {
      path?: string;
    }
  ) => {
    if (!state.explorers.panel0) {
      state.explorers.panel0 = {
        height: 200,
        state: {
          path: value.path ?? process.cwd(),
        },
      };

      return clone(state);
    }
    if (!state.explorers.panel1) {
      state.explorers.panel1 = {
        height: 200,
        state: {
          path: value.path ?? process.cwd(),
        },
      };

      return clone(state);
    }

    console.warn('Cannot open explorer', state);
    return state;
  },
  closeExplorer: (state, value: number) => {
    if (value === 1 && state.explorers.panel1) {
      state.explorers.panel1 = undefined;

      return clone(state);
    }
    if (value === 0 && state.explorers.panel0) {
      state.explorers.panel0 = undefined;

      return clone(state);
    }

    console.warn(`Incorrect index: ${value}`);
    return state;
  },
  setExplorerSize: (
    state,
    value: {
      height: number;
      index: number;
    }
  ) => {
    if (value.index === 1 && state.explorers.panel1) {
      state.explorers.panel1.height = value.height;

      return clone(state);
    }
    if (value.index === 0 && state.explorers.panel0) {
      state.explorers.panel0.height = value.height;

      return clone(state);
    }

    console.warn(`Incorrect index: ${value.index}`);
    return state;
  },
  changeExplorerDirectory: (
    state,
    value: {
      path: string;
      index: number;
    }
  ) => {
    if (value.index === 1 && state.explorers.panel1) {
      state.explorers.panel1.state.path = value.path;

      return clone(state);
    }
    if (value.index === 0 && state.explorers.panel0) {
      state.explorers.panel0.state.path = value.path;

      return clone(state);
    }

    console.warn(`Incorrect index: ${value.index}`);
    return state;
  },
});

export { explorerApi };
