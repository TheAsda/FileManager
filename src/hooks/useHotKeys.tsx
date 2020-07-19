import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  PropsWithChildren,
  useEffect,
} from 'react';
import { KeyMap, Commands } from '@fm/common';
import { noop, values, flatten, forEach, keys } from 'lodash';
import { bind, unbind, bindGlobal } from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind';

type Action =
  | {
      type: 'setKeyMap';
      keymap: KeyMap;
    }
  | {
      type: 'setHotKeys';
      hotkeys: Commands;
    };

interface HotKeysState {
  keymap: KeyMap;
  hotKeys: Commands;
}

const focusReducer = (state: HotKeysState, action: Action): HotKeysState => {
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
    case 'setHotKeys': {
      return {
        ...state,
        hotKeys: action.hotkeys,
      };
    }
    default:
      return state;
  }
};

const HotKeysContext = createContext<{ data: HotKeysState; dispatch: Dispatch<Action> }>({
  data: {
    keymap: {},
    hotKeys: {},
  },
  dispatch: noop,
});

const HotKeysProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [data, dispatch] = useReducer(focusReducer, {
    keymap: {},
    hotKeys: {},
  });

  const bindHotKeys = () => {
    console.log('bindHotKeys -> data.hotKeys', data.hotKeys);
    forEach(keys(data.hotKeys), (commandName) => {
      const bindings = data.keymap[commandName];

      bindGlobal(bindings, data.hotKeys[commandName]);
    });
  };

  const unbindAll = () => {
    const allBindings = flatten(values(data.keymap));
    unbind(allBindings);
  };

  useEffect(() => {
    unbindAll();
    bindHotKeys();
  }, [data.hotKeys]);

  return <HotKeysContext.Provider value={{ data, dispatch }}>{children}</HotKeysContext.Provider>;
};

const useHotKeys = () => useContext(HotKeysContext);

export { HotKeysProvider, useHotKeys };
