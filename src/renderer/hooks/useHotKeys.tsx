import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { KeyMap, Commands } from '@fm/common';
import { noop, values, flatten, forEach, keys, slice, merge } from 'lodash';
import { unbind, bindGlobal } from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind';
import { useValidatedContext } from './useValidatedContext';

const HotKeysContext = createContext<{
  setKeyMap: (keyMap: KeyMap) => void;
  addHotKeys: (hotKeys: Commands, push?: boolean) => void;
  removeHotKeys: () => void;
  setGlobalHotKeys: (hotKeys: Commands) => void;
  removeGlobalHotKeys: (hotKeys: string[]) => void;
}>({
  setKeyMap: noop,
  addHotKeys: noop,
  removeHotKeys: noop,
  setGlobalHotKeys: noop,
  removeGlobalHotKeys: noop,
});

const HotKeysProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [keyMap, setKeyMapState] = useState<KeyMap>({});
  const [hotKeys, setHotKeys] = useState<Commands[]>([]);
  const [globalHotKeys, setGlobalHotKeysState] = useState<Commands>({});

  const setKeyMap = (keyMap: KeyMap) => {
    setKeyMapState(keyMap);
  };

  const addHotKeys = (hotKeys: Commands, push = false) => {
    if (push) {
      setHotKeys((state) => [...state, hotKeys]);
      return;
    }

    setHotKeys([hotKeys]);
  };

  const removeHotKeys = () => {
    setHotKeys((state) => slice(state, 0, state.length - 1));
  };

  const setGlobalHotKeys = (hotKeys: Commands) => {
    setGlobalHotKeysState((state) => merge(state, hotKeys));
  };

  const removeGlobalHotKeys = (hotKeys: string[]) => {
    setGlobalHotKeysState((state) => {
      forEach(hotKeys, (item) => {
        delete state[item];
      });

      return state;
    });
  };

  const bindGlobalHotKeys = () => {
    forEach(keys(globalHotKeys), (name) => {
      const bindings = keyMap[name];

      if (!bindings) {
        console.log(`Haven't found bindings for global ${name}`);
        return;
      }

      bindGlobal(bindings, globalHotKeys[name]);
    });
  };

  const bindHotKeys = () => {
    const lastHotKeys = hotKeys[hotKeys.length - 1];
    forEach(keys(lastHotKeys), (name) => {
      const bindings = keyMap[name];

      if (!bindings) {
        console.log(`Haven't found bindings for ${name}`);
        return;
      }

      bindGlobal(bindings, lastHotKeys[name]);
    });
  };

  const unbindAll = () => {
    const allBindings = flatten(values(keyMap));
    unbind(allBindings);
  };

  useEffect(() => {
    bindGlobalHotKeys();
    unbindAll();
    bindHotKeys();
  }, [hotKeys]);

  return (
    <HotKeysContext.Provider
      value={{ setKeyMap, addHotKeys, removeHotKeys, setGlobalHotKeys, removeGlobalHotKeys }}
    >
      {children}
    </HotKeysContext.Provider>
  );
};

const useHotKeys = () => useValidatedContext(HotKeysContext);

export { HotKeysProvider, useHotKeys };
