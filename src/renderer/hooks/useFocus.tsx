import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  PropsWithChildren,
  useEffect,
} from 'react';
import { PanelType } from '@fm/common';
import { noop } from 'lodash';

type FocusAction =
  | {
      type: 'focusPanel';
      item: PanelType;
    }
  | {
      type: 'focusItem';
      index: number;
    }
  | {
      type: 'toggleItem';
    }
  | {
      type: 'togglePanel';
    };

interface FocusState {
  focusedPanel: PanelType;
  index?: number;
}

const focusReducer = (state: FocusState, action: FocusAction): FocusState => {
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
    case 'toggleItem': {
      if (state.index === undefined || state.focusedPanel === 'preview') {
        return state;
      }

      return {
        ...state,
        index: state.index ^ 1,
      };
    }
    case 'togglePanel': {
      switch (state.focusedPanel) {
        case 'explorer': {
          return {
            ...state,
            focusedPanel: 'preview',
            index: undefined,
          };
        }
        case 'preview': {
          return {
            ...state,
            focusedPanel: 'terminal',
            index: 0,
          };
        }
        case 'terminal': {
          return {
            ...state,
            focusedPanel: 'explorer',
            index: 0,
          };
        }
      }
    }
  }
};

const FocusContext = createContext<{ data: FocusState; dispatch: Dispatch<FocusAction> }>({
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

  const handleKey = (event: KeyboardEvent) => {
    if (event.keyCode === 9) {
      event.preventDefault();
      if (event.ctrlKey) {
        if (event.shiftKey) {
          dispatch({
            type: 'togglePanel',
          });
          return;
        }

        if (data.focusedPanel !== 'preview') {
          dispatch({
            type: 'toggleItem',
          });
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKey, true);
    return () => {
      window.removeEventListener('keydown', handleKey, true);
    };
  }, []);

  return <FocusContext.Provider value={{ data, dispatch }}>{children}</FocusContext.Provider>;
};

const useFocus = () => useContext(FocusContext);

export { FocusProvider, useFocus, FocusState, FocusAction };
