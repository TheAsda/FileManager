import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { Settings } from '@fm/common';
import { noop } from 'lodash';
import { ipcRenderer } from 'electron';
import { IpcRendererEvent } from '../../main/rendererEvent';
import { IpcMainEvent } from 'main/mainEvent';

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
    setState(ipcRenderer.sendSync(IpcMainEvent.GET_SETTINGS));
    ipcRenderer.on(IpcRendererEvent.SETTINGS, (event, args: Settings[]) => {
      setState(args[0]);
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings: state, setValue: noop, resetSettings: noop }}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => useContext(SettingsContext);

export { SettingsProvider, useSettings };
