import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { Settings, Channels } from '@fm/common';
import { noop } from 'lodash';
import { ipcRenderer } from 'electron';

const SettingsContext = createContext<{
  settings?: Settings;
  setValue: (key: string, value: unknown) => void;
  resetSettings: () => void;
}>({
  setValue: noop,
  resetSettings: noop,
});

const SettingsProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, setState] = useState<Settings>();

  useEffect(() => {
    ipcRenderer.send(Channels.GET_SETTINGS);
    ipcRenderer.on(Channels.SETTINGS, (event, args: Settings) => {
      setState(args);
    });
  }, []);

  const setValue = (key: string, value: unknown) => {
    ipcRenderer.send(Channels.SET_SETTINGS, { key, value });
  };

  const resetSettings = () => {
    ipcRenderer.send(Channels.RESET_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings: state, setValue, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => useContext(SettingsContext);

export { SettingsProvider, useSettings };
