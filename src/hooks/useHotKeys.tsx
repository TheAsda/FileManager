import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  PropsWithChildren,
  useEffect,
} from 'react';
import { KeyMap, Commands } from '@fm/common';
import { noop, values, flatten, forEach, keys, filter, includes } from 'lodash';
import { bind, bindGlobal, unbind } from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind';

type Action =
  | {
      type: 'setKeyMap';
      keymap: KeyMap;
    }
  | {
      type: 'setArea';
      name: string;
      handlers: Commands;
      activate?: boolean;
    }
  | {
      type: 'setGlobalArea';
      name: string;
      handlers: Commands;
      activate?: boolean;
    }
  | {
      type: 'unsetArea';
      name: string;
    }
  | {
      type: 'unsetGlobalArea';
      name: string;
    }
  | {
      type: 'activateArea';
      name: string;
    }
  | {
      type: 'setWindowCommands';
      handlers: Commands;
    };

interface HotKeysState {
  keymap: KeyMap;
  areas: { [name: string]: Commands };
  activeArea: string | null;
  globals: string[];
  window: Commands;
}

const focusReducer = (state: HotKeysState, action: Action): HotKeysState => {
  console.log('action', action);

  switch (action.type) {
    case 'setKeyMap': {
      return {
        ...state,
        keymap: {
          ...state.keymap,
          ...action.keymap,
        },
      };
    }
    case 'setArea': {
      return {
        ...state,
        areas: {
          ...state.areas,
          [action.name]: action.handlers,
        },
        activeArea: action.activate ? action.name : state.activeArea,
      };
    }
    case 'setGlobalArea': {
      return {
        ...state,
        areas: {
          ...state.areas,
          [action.name]: action.handlers,
        },
        activeArea: action.activate ? action.name : state.activeArea,
        globals: [...state.globals, action.name],
      };
    }
    case 'unsetArea': {
      delete state.areas[action.name];
      return {
        ...state,
        activeArea: state.activeArea === action.name ? null : state.activeArea,
      };
    }
    case 'unsetGlobalArea': {
      delete state.areas[action.name];
      return {
        ...state,
        activeArea: state.activeArea === action.name ? null : state.activeArea,
        globals: filter(state.globals, (item) => item !== action.name),
      };
    }
    case 'activateArea': {
      return {
        ...state,
        activeArea: action.name,
      };
    }
    case 'setWindowCommands': {
      return {
        ...state,
        window: {
          ...state.window,
          ...action.handlers,
        },
      };
    }
  }
};

const HotKeysContext = createContext<{ data: HotKeysState; dispatch: Dispatch<Action> }>({
  data: {
    activeArea: null,
    areas: {},
    keymap: {},
    globals: [],
    window: {},
  },
  dispatch: noop,
});

const HotKeysProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [data, dispatch] = useReducer(focusReducer, {
    activeArea: null,
    areas: {},
    keymap: {},
    globals: [],
    window: {},
  });

  const bindHotKeys = () => {
    if (!data.activeArea) {
      return;
    }

    const activeArea = data.areas[data.activeArea];
    console.log('bindHotKeys -> data.activeArea', data.activeArea);
    console.log('bindHotKeys -> data.areas', data.areas);

    const b = includes(data.globals, data.activeArea) ? bindGlobal : bind;

    forEach(keys(activeArea), (commandName) => {
      const bindings = data.keymap[commandName];

      b(bindings, activeArea[commandName]);
    });
  };

  const bindWindowHoyKeys = () => {
    forEach(keys(data.window), (commandName) => {
      const bindings = data.keymap[commandName];

      bindGlobal(bindings, data.window[commandName]);
    });
  };

  const unbindAll = () => {
    const allBindings = flatten(values(data.keymap));
    unbind(allBindings);
  };

  useEffect(() => {
    unbindAll();
    bindWindowHoyKeys();
    bindHotKeys();
  }, [data.activeArea, data.areas]);

  useEffect(bindWindowHoyKeys, [data.window]);

  return <HotKeysContext.Provider value={{ data, dispatch }}>{children}</HotKeysContext.Provider>;
};

const useHotKeys = () => useContext(HotKeysContext);

export { HotKeysProvider, useHotKeys };
