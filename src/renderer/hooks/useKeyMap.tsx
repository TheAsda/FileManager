import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { Channels, KeyMap } from '@fm/common';
import { noop } from 'lodash';
import { ipcRenderer } from 'electron';

const KeyMapContext = createContext<{
  keymap?: KeyMap;
  resetKeyMap: () => void;
}>({
  resetKeyMap: noop,
});

const KeyMapProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, setState] = useState<KeyMap>();

  useEffect(() => {
    ipcRenderer.send(Channels.GET_KEYMAP);
    ipcRenderer.on(Channels.KEYMAP, (event, args: KeyMap) => {
      setState(args);
    });
  }, []);

  const resetKeyMap = () => {
    ipcRenderer.send(Channels.RESET_KEYMAP);
  };

  return (
    <KeyMapContext.Provider value={{ keymap: state, resetKeyMap }}>
      {children}
    </KeyMapContext.Provider>
  );
};

const useKeyMap = () => useContext(KeyMapContext);

export { KeyMapProvider, useKeyMap };
