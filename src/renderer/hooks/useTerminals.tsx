import React, { createContext, useReducer, useContext, Dispatch, PropsWithChildren } from 'react';
import { container, TYPES, ITerminalManager, TerminalPanelInfo } from '@fm/common';
import { map, isString, noop, filter } from 'lodash';

type Action = { type: 'spawn'; path?: string } | { type: 'destroy'; id: number };

const getTerminalManager = () => {
  return container.get<ITerminalManager>(TYPES.ITerminalManager);
};

const terminalReducer = (state: ITerminalManager[], action: Action) => {
  switch (action.type) {
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
      return filter(state, (item) => {
        if (item.getId() === action.id) {
          item.destroy();
          return false;
        }
        return true;
      });
    }
  }
};

const TerminalsContext = createContext<{ data: ITerminalManager[]; dispatch: Dispatch<Action> }>({
  data: [],
  dispatch: noop,
});

interface TerminalsProviderProps {
  initialState?: TerminalPanelInfo[];
}

const TerminalsProvider = ({
  children,
  initialState,
}: PropsWithChildren<TerminalsProviderProps>) => {
  const [data, dispatch] = useReducer(terminalReducer, [], () => {
    if (!initialState || initialState.length === 0) {
      return [getTerminalManager()];
    }

    return map(initialState, (item) => {
      const manager = getTerminalManager();
      if (item.directory) {
        manager.changeDirectory(item.directory);
      } else {
        manager.changeDirectory(process.cwd());
      }
      return manager;
    });
  });

  return (
    <TerminalsContext.Provider value={{ data, dispatch }}>{children}</TerminalsContext.Provider>
  );
};

const useTerminals = () => useContext(TerminalsContext);

export { TerminalsProvider, useTerminals };
