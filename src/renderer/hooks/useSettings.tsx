import React, { createContext, useState, PropsWithChildren, useEffect } from 'react';
import { Settings, Channels, ConfirmTypes } from '@fm/common';
import { noop } from 'lodash';
import { ipcRenderer } from 'electron';
import { useValidatedContext } from './useValidatedContext';

const SettingsContext = createContext<{
  settings?: Settings;
  setValue: (settings: Settings) => void;
  resetSettings: () => void;
}>({
  setValue: noop,
  resetSettings: noop,
});

const SettingsProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, setState] = useState<Settings>();

  useEffect(() => {
    // On first render request settings
    ipcRenderer.send(Channels.GET_SETTINGS);

    // Save incoming settings
    ipcRenderer.on(Channels.SETTINGS, (event, args: Settings) => {
      setState(args);
    });
  }, []);

  useEffect(() => {
    // Action before application quits
    ipcRenderer.on(Channels.BEFORE_QUIT, () => {
      // Save settings
      ipcRenderer.send(Channels.SET_SETTINGS, state);

      // Confirm saving
      ipcRenderer.send(Channels.QUIT_CONFIRM, ConfirmTypes.SETTINGS);
    });
  }, [state]);

  const setValue = (settings: Settings) => {
    setState(settings);
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

const useSettings = () => useValidatedContext(SettingsContext);

export { SettingsProvider, useSettings };
