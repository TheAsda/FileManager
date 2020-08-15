import React, { createContext, useContext, PropsWithChildren, useState, useEffect } from 'react';
import { ITerminalManager, TerminalManager } from '@fm/common';
import { map, noop, filter } from 'lodash';
import { TerminalPanelInfo } from 'common/interfaces/Layout';
import { useSettings } from './useSettings';

const TerminalsContext = createContext<{
  terminals: ITerminalManager[];
  closeTerminal: (id: number) => void;
  openTerminal: () => void;
}>({
  terminals: [],
  closeTerminal: noop,
  openTerminal: noop,
});

interface TerminalsProviderProps {
  initialState?: TerminalPanelInfo[];
}

const TerminalsProvider = ({ children }: PropsWithChildren<TerminalsProviderProps>) => {
  const [state, setState] = useState<ITerminalManager[]>([]);
  const { settings, setValue } = useSettings();

  useEffect(() => {
    if (state.length !== settings?.layout?.terminals.panels.length) {
      if (settings?.layout?.terminals.panels && settings.layout.terminals.panels.length > 0) {
        setState(
          map(settings.layout.terminals.panels, (item) => {
            const manager = new TerminalManager();
            manager.changeDirectory(item.directory);
            return manager;
          })
        );
      }
    }
  }, [settings?.layout?.terminals]);

  const closeTerminal = (id: number) => {
    setState((state) => filter(state, (item) => item.getId() !== id));
    setValue
  };

  const openTerminal = (path?: string) => {
    if (
      settings?.layout?.explorers.hidden !== true &&
      settings?.layout?.explorers.panels &&
      settings?.layout?.explorers.panels.length < 2
    ) {
      const manager = new TerminalManager();
      if (path) {
        setValue({
          ...settings,
          layout: {
            ...settings.layout,
            terminals: {
              ...settings.layout.terminals,
              panels: [...settings.layout.explorers.panels, { directory: path }],
            },
          },
        });
        manager.changeDirectory(path);
      } else {
        setValue({
          ...settings,
          layout: {
            ...settings.layout,
            terminals: {
              ...settings.layout.terminals,
              panels: [...settings.layout.explorers.panels, { directory: process.cwd() }],
            },
          },
        });
      }
      setState((state) => [...state, manager]);
    }
  };

  return (
    <TerminalsContext.Provider value={{ terminals: state, closeTerminal, openTerminal }}>
      {children}
    </TerminalsContext.Provider>
  );
};

const useTerminals = () => useContext(TerminalsContext);

export { TerminalsProvider, useTerminals };
