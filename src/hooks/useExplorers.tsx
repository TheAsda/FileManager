import React, { createContext, useReducer, ReactNode, useContext, Dispatch } from 'react';
import { IExplorerManager, ExplorerPanelInfo, container, TYPES } from '@fm/common';
import { map, isString, isArray, noop } from 'lodash';

type Action =
  | { type: 'init'; state?: ExplorerPanelInfo[] }
  | { type: 'spawn'; path?: string | string[] }
  | { type: 'destroy'; index: number };

const getExplorerManager = () => {
  return container.get<IExplorerManager>(TYPES.IExplorerManager);
};

const explorerReducer = (state: IExplorerManager[], action: Action) => {
  switch (action.type) {
    case 'init': {
      if (state.length > 0) {
        return state;
      }

      if (action.state) {
        return map(action.state, (item) => {
          const manager = getExplorerManager();
          if (item.initialDirectory) {
            manager.setPathFromString(item.initialDirectory);
          }
          return manager;
        });
      }

      return [getExplorerManager()];
    }
    case 'spawn': {
      if (state.length === 2) {
        return state;
      }

      const manager = getExplorerManager();

      if (isString(action.path)) {
        manager.setPathFromString(action.path);
      } else if (isArray(action.path)) {
        manager.setPath(action.path);
      } else {
        manager.setPathFromString('D:');
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

const ExplorersContext = createContext<{ data: IExplorerManager[]; dispatch: Dispatch<Action> }>({
  data: [],
  dispatch: noop,
});

const ExplorersProvider = ({ children }: { children: ReactNode }) => {
  const [data, dispatch] = useReducer(explorerReducer, []);

  return (
    <ExplorersContext.Provider value={{ data, dispatch }}>{children}</ExplorersContext.Provider>
  );
};

const useExplorers = () => useContext(ExplorersContext);

export { ExplorersProvider, useExplorers };
