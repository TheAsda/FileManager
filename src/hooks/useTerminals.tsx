import React, { createContext, useReducer, ReactNode, useContext, Dispatch } from 'react';
import { container, TYPES, ITerminalManager, TerminalPanelInfo } from '@fm/common';
import { map, isString, noop } from 'lodash';

type Action =
  | { type: 'init'; state?: TerminalPanelInfo[] }
  | { type: 'spawn'; path?: string }
  | { type: 'destroy'; index: number };

const getTerminalManager = () => {
  return container.get<ITerminalManager>(TYPES.ITerminalManager);
};

const terminalReducer = (state: ITerminalManager[], action: Action) => {
  switch (action.type) {
    case 'init': {
      if (state.length > 0) {
        return state;
      }

      if (action.state) {
        return map(action.state, (item) => {
          const manager = getTerminalManager();
          if (item.initialDirectory) {
            manager.changeDirectory(item.initialDirectory);
          }
          return manager;
        });
      }

      return [getTerminalManager()];
    }
    case 'spawn': {
      if (state.length === 2) {
        return state;
      }

      const manager = getTerminalManager();

      if (isString(action.path)) {
        manager.changeDirectory(action.path);
      }

      return [...state, manager];
    }
    case 'destroy': {
      if (action.index > 1) {
        return state;
      }

      return action.index === 0 ? [state[1]] : [state[0]];
    }
  }
};

const TerminalsContext = createContext<{ data: ITerminalManager[]; dispatch: Dispatch<Action> }>({
  data: [],
  dispatch: noop,
});

const TerminalsProvider = ({ children }: { children: ReactNode }) => {
  const [data, dispatch] = useReducer(terminalReducer, []);

  return (
    <TerminalsContext.Provider value={{ data, dispatch }}>{children}</TerminalsContext.Provider>
  );
};

const useTerminals = () => useContext(TerminalsContext);

export { TerminalsProvider, useTerminals };
