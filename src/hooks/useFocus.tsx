import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  ReactNode,
  PropsWithChildren,
  useEffect,
} from 'react';
import { PanelType } from '../common';
import { noop } from 'lodash';

type Action =
  | {
      type: 'focusPanel';
      item: PanelType;
    }
  | {
      type: 'focusItem';
      index: number;
    };

interface FocusState {
  focusedPanel: PanelType;
  index?: number;
}

const focusReducer = (state: FocusState, action: Action): FocusState => {
  console.log(action, state);
  switch (action.type) {
    case 'focusPanel': {
      return {
        ...state,
        focusedPanel: action.item,
      };
    }
    case 'focusItem': {
      return {
        ...state,
        index: action.index,
      };
    }
  }
};

const FocusContext = createContext<{ data: FocusState; dispatch: Dispatch<Action> }>({
  data: {
    focusedPanel: 'explorer',
    index: 0,
  },
  dispatch: noop,
});

const FocusProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [data, dispatch] = useReducer(focusReducer, {
    focusedPanel: 'explorer',
    index: 0,
  });

  return <FocusContext.Provider value={{ data, dispatch }}>{children}</FocusContext.Provider>;
};

const useFocus = () => useContext(FocusContext);

export { FocusProvider, useFocus };
