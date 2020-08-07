import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { KeyMap, Commands, DISABLED_KEYS } from '@fm/common';
import { noop, values, flatten, forEach, keys, slice, merge, concat, constant } from 'lodash';
import { useValidatedContext } from './useValidatedContext';
import hotkeys from 'hotkeys-js';

const HotKeysContext = createContext<{
  setKeyMap: (keyMap: KeyMap) => void;
  addHotKeys: (hotKeys: Commands, push?: boolean, raw?: boolean) => void;
  removeHotKeys: () => void;
  setGlobalHotKeys: (hotKeys: Commands, raw?: boolean) => void;
  removeGlobalHotKeys: (hotKeys: string[]) => void;
}>({
  setKeyMap: noop,
  addHotKeys: noop,
  removeHotKeys: noop,
  setGlobalHotKeys: noop,
  removeGlobalHotKeys: noop,
});

hotkeys.filter = constant(true);

const HotKeysProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [keyMap, setKeyMapState] = useState<KeyMap>({});
  const [hotKeys, setHotKeys] = useState<Commands[]>([]);
  const [rawHotKeys, setRawHotKeys] = useState<Commands>({});
  const [globalHotKeys, setGlobalHotKeysState] = useState<Commands>({});
  const [rawGlobalHotKeys, setRawGlobalHotKeys] = useState<Commands>({});

  const setKeyMap = (keyMap: KeyMap) => {
    setKeyMapState(keyMap);
  };

  const addHotKeys = (hotKeys: Commands, push = false, raw = false) => {
    if (raw) {
      setRawHotKeys((state) => merge(state, hotKeys));
      return;
    }

    if (push) {
      setHotKeys((state) => [...state, hotKeys]);
      return;
    }

    setHotKeys([hotKeys]);
  };

  const removeHotKeys = () => {
    setHotKeys((state) => slice(state, 0, state.length - 1));
  };

  const setGlobalHotKeys = (hotKeys: Commands, raw = false) => {
    if (raw) {
      setRawGlobalHotKeys((state) => merge(state, hotKeys));
      return;
    }

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

  const preventDefaultWrapper = (action: (event: KeyboardEvent) => void) => (
    event: KeyboardEvent
  ) => {
    event.preventDefault();
    action(event);
  };

  const bindGlobalHotKeys = () => {
    forEach(keys(rawGlobalHotKeys), (key) => {
      hotkeys(key, preventDefaultWrapper(rawGlobalHotKeys[key]));
    });

    forEach(keys(globalHotKeys), (name) => {
      const bindings = keyMap[name];

      if (!bindings) {
        console.log(`Haven't found bindings for global ${name}`);
        return;
      }

      hotkeys(bindings.join(', '), preventDefaultWrapper(globalHotKeys[name]));
    });
  };

  const bindHotKeys = () => {
    forEach(keys(rawHotKeys), (key) => {
      hotkeys(key, preventDefaultWrapper(rawHotKeys[key]));
    });

    const lastHotKeys = hotKeys[hotKeys.length - 1];
    forEach(keys(lastHotKeys), (name) => {
      const bindings = keyMap[name];

      if (!bindings) {
        console.log(`Haven't found bindings for ${name}`);
        return;
      }

      hotkeys(bindings.join(', '), preventDefaultWrapper(lastHotKeys[name]));
    });
  };

  const unbindAll = () => {
    const allBindings = flatten(values(keyMap));
    const allRawBindings = concat(keys(rawHotKeys), keys(rawGlobalHotKeys));
    hotkeys.unbind(concat(allBindings, allRawBindings).join(', '));
  };

  const disableKeys = () => {
    hotkeys(DISABLED_KEYS.join(', '), (event) => event.preventDefault());
  };

  useEffect(() => {
    console.log('Update hotkeys');
    unbindAll();
    disableKeys();
    bindGlobalHotKeys();
    bindHotKeys();
  }, [hotKeys, globalHotKeys, rawGlobalHotKeys, rawHotKeys]);

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
