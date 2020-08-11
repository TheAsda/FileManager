import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { Channels } from '@fm/common';
import { noop } from 'lodash';
import { ipcRenderer } from 'electron';

const PathsContext = createContext<{
  paths: string[];
  addPath: (value: string) => void;
}>({
  paths: [],
  addPath: noop,
});

const PathsProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, setState] = useState<string[]>([]);

  useEffect(() => {
    ipcRenderer.send(Channels.GET_PATH);
    ipcRenderer.on(Channels.PATH, (event, args: string[]) => {
      setState(args);
    });
  }, []);

  const addPath = (value: string) => {
    ipcRenderer.send(Channels.ADD_PATH, value);
  };

  return (
    <PathsContext.Provider value={{ paths: state, addPath }}>{children}</PathsContext.Provider>
  );
};

const usePaths = () => useContext(PathsContext);

export { PathsProvider, usePaths };
