import { createApi } from 'effector';
import { store } from '../store';
import { TerminalManager } from '@fm/common';
import { clone } from 'lodash';

const terminalApi = createApi(store, {
  openTerminal: (
    state,
    value: {
      path?: string;
    }
  ) => {
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
    return state;
  },
  closeTerminal: (state, value: number) => {
    if (value === 1 && state.terminals.panel1) {
      state.terminals.panel1 = undefined;

      return clone(state);
    }
    if (value === 0 && state.terminals.panel0) {
      state.terminals.panel0 = undefined;

      return clone(state);
    }

    console.warn(`Incorrect index: ${value}`);
    return state;
  },
  setTerminalSize: (
    state,
    value: {
      height: number;
      index: number;
    }
  ) => {
    if (value.index === 1 && state.terminals.panel1) {
      state.terminals.panel1.height = value.height;

      return clone(state);
    }
    if (value.index === 0 && state.terminals.panel0) {
      state.terminals.panel0.height = value.height;

      return clone(state);
    }

    console.warn(`Incorrect index: ${value.index}`);
    return state;
  },
  changeTerminalDirectory: (
    state,
    value: {
      path: string;
      index: number;
    }
  ) => {
    if (value.index === 1 && state.terminals.panel1) {
      state.terminals.panel1.manager.changeDirectory(value.path);

      return clone(state);
    }
    if (value.index === 0 && state.terminals.panel0) {
      state.terminals.panel0.manager.changeDirectory(value.path);

      return clone(state);
    }

    console.warn(`Incorrect index: ${value.index}`);
    return state;
  },
});

export { terminalApi };
