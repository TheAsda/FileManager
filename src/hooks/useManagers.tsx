import {
  ISettingsManager,
  IThemesManager,
  IKeysManager,
  IDirectoryManager,
  ITerminalManager,
  IPanelsManager,
  IExplorerManager,
} from '@fm/common';
import { container, TYPES } from '../common/ioc';
import React, { createContext, useContext } from 'react';

const settingsManager = container.get<ISettingsManager>(TYPES.ISettingsManager);
const keysManager = container.get<IKeysManager>(TYPES.IKeysManager);
const themesManager = container.get<IThemesManager>(TYPES.IThemesManager);
const directoryManager = container.get<IDirectoryManager>(TYPES.IDirectoryManager);
const panelsManager = container.get<IPanelsManager>(TYPES.IPanelsManager);

const getTerminalManager = () => {
  return container.get<ITerminalManager>(TYPES.ITerminalManager);
};

const getExplorerManager = () => {
  return container.get<IExplorerManager>(TYPES.IExplorerManager);
};

const ManagersContext = createContext<{
  settingsManager: ISettingsManager;
  keysManager: IKeysManager;
  themesManager: IThemesManager;
  directoryManager: IDirectoryManager;
  panelsManager: IPanelsManager;
  getTerminalManager(): ITerminalManager;
  getExplorerManager(): IExplorerManager;
}>({
  settingsManager,
  keysManager,
  themesManager,
  directoryManager,
  panelsManager,
  getTerminalManager,
  getExplorerManager,
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
        panelsManager,
        getTerminalManager,
        getExplorerManager,
      }}
    >
      {children}
    </ManagersContext.Provider>
  );
};

export { ManagersProvider, useManagers };
