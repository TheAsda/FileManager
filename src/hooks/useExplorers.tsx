import React, { createContext, useReducer, useContext, Dispatch, PropsWithChildren } from 'react';
import { IExplorerManager, ExplorerPanelInfo, container, TYPES } from '@fm/common';
import { map, noop } from 'lodash';
import { normalizePath } from 'filemancore';

type Action = { type: 'spawn'; path?: string } | { type: 'destroy'; index: number };

const getExplorerManager = () => {
  return container.get<IExplorerManager>(TYPES.IExplorerManager);
};

const explorerReducer = (state: IExplorerManager[], action: Action) => {
  switch (action.type) {
    case 'spawn': {
      if (state.length === 2) {
        return state;
      }

      const manager = getExplorerManager();

      if (action.path) {
        manager.setPath(action.path);
      } else {
        manager.setPath(normalizePath('.'));
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

interface ExplorersProviderProps {
  initialState?: ExplorerPanelInfo[];
}

const ExplorersProvider = ({
  children,
  initialState,
}: PropsWithChildren<ExplorersProviderProps>) => {
  const [data, dispatch] = useReducer(explorerReducer, [], () => {
    if (!initialState || initialState.length === 0) {
      return [getExplorerManager()];
    }

    return map(initialState, (item) => {
      const manager = getExplorerManager();
      if (item.initialDirectory) {
        manager.setPath(item.initialDirectory);
      } else {
        manager.setPath(process.cwd());
      }
      return manager;
    });
  });

  return (
    <ExplorersContext.Provider value={{ data, dispatch }}>{children}</ExplorersContext.Provider>
  );
};

const useExplorers = () => useContext(ExplorersContext);

export { ExplorersProvider, ExplorersProviderProps, useExplorers };
