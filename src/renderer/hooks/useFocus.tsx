import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  PropsWithChildren,
  useEffect,
} from 'react';
import { PanelType, ISettingsManager, SettingsManager } from '@fm/common';
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
    }
  | {
      type: 'setSettingsManager';
      settingsManager: ISettingsManager;
    };

interface FocusState {
  focusedPanel: PanelType;
  index?: number;
  settingsManager: ISettingsManager;
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
      if (state.focusedPanel === 'explorer') {
        if (!state.settingsManager.getSettings().layout.preview.hidden) {
          return {
            ...state,
            focusedPanel: 'preview',
          };
        }
        if (!state.settingsManager.getSettings().layout.terminals.hidden) {
          return {
            ...state,
            focusedPanel: 'terminal',
          };
        }
      }
      if (state.focusedPanel === 'preview') {
        if (!state.settingsManager.getSettings().layout.terminals.hidden) {
          return {
            ...state,
            focusedPanel: 'terminal',
          };
        }
        if (!state.settingsManager.getSettings().layout.explorers.hidden) {
          return {
            ...state,
            focusedPanel: 'explorer',
          };
        }
      }
      if (state.focusedPanel === 'terminal') {
        if (!state.settingsManager.getSettings().layout.explorers.hidden) {
          return {
            ...state,
            focusedPanel: 'explorer',
          };
        }
        if (!state.settingsManager.getSettings().layout.preview.hidden) {
          return {
            ...state,
            focusedPanel: 'preview',
          };
        }
      }
      return state;
    }
    case 'setSettingsManager': {
      return {
        ...state,
        settingsManager: action.settingsManager,
      };
    }
  }
};

const FocusContext = createContext<{ data: FocusState; dispatch: Dispatch<FocusAction> }>({
  data: {
    focusedPanel: 'explorer',
    index: 0,
    settingsManager: new SettingsManager(),
  },
  dispatch: noop,
});

const FocusProvider = ({
  children,
  settingsManager,
}: PropsWithChildren<{
  settingsManager: ISettingsManager;
}>) => {
  const [data, dispatch] = useReducer(focusReducer, {
    focusedPanel: 'explorer',
    index: 0,
    settingsManager,
  });

  useEffect(() => {
    dispatch({
      type: 'setSettingsManager',
      settingsManager,
    });
  }, [settingsManager]);

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

  console.log('data', data);
  return <FocusContext.Provider value={{ data, dispatch }}>{children}</FocusContext.Provider>;
};

const useFocus = () => useContext(FocusContext);

export { FocusProvider, useFocus, FocusState, FocusAction };
