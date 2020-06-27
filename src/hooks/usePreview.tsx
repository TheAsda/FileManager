import React, { Dispatch, createContext, useReducer, ReactNode, useContext } from 'react';
import { noop } from 'lodash';

type Action =
  | { type: 'init'; display?: boolean }
  | { type: 'display'; path: string | null }
  | { type: 'destroy' };

interface ReducerState {
  path: string | null;
  display: boolean;
}

const previewReducer = (state: ReducerState, action: Action): ReducerState => {
  switch (action.type) {
    case 'init': {
      return {
        path: null,
        display: action.display ?? false,
      };
    }
    case 'display': {
      return {
        display: true,
        path: action.path,
      };
    }
    case 'destroy': {
      return {
        path: null,
        display: false,
      };
    }
  }
};

const PreviewContext = createContext<{ data: ReducerState; dispatch: Dispatch<Action> }>({
  data: {
    display: false,
    path: null,
  },
  dispatch: noop,
});

const PreviewProvider = ({ children }: { children: ReactNode }) => {
  const [data, dispatch] = useReducer(previewReducer, {
    path: null,
    display: false,
  });

  return <PreviewContext.Provider value={{ data, dispatch }}>{children}</PreviewContext.Provider>;
};

const usePreview = () => useContext(PreviewContext);

export { PreviewProvider, usePreview };
