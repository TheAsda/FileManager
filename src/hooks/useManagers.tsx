import {
  ISettingsManager,
  IThemesManager,
  IKeysManager,
  IDirectoryManager,
  ITerminalManager,
} from '@fm/common';
import { container, TYPES } from '../common/ioc';
import React, { createContext, useContext } from 'react';

const settingsManager = container.get<ISettingsManager>(TYPES.ISettingsManager);
const keysManager = container.get<IKeysManager>(TYPES.IKeysManager);
const themesManager = container.get<IThemesManager>(TYPES.IThemesManager);
const directoryManager = container.get<IDirectoryManager>(
  TYPES.IDirectoryManager
);

const getTerminalManager = () => {
  return container.get<ITerminalManager>(TYPES.ITerminalManager);
};

const ManagersContext = createContext<{
  settingsManager: ISettingsManager;
  keysManager: IKeysManager;
  themesManager: IThemesManager;
  directoryManager: IDirectoryManager;
  getTerminalManager(): ITerminalManager;
}>({
  settingsManager,
  keysManager,
  themesManager,
  directoryManager,
  getTerminalManager,
});

const useManagers = () => useContext(ManagersContext);

const ManagersProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <ManagersContext.Provider
      value={{
        keysManager,
        settingsManager,
        themesManager,
        directoryManager,
        getTerminalManager,
      }}
    >
      {children}
    </ManagersContext.Provider>
  );
};

export { ManagersProvider, useManagers };
