import React, { useState, createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { noop } from 'lodash';
import { Theme, Channels } from '@fm/common';
import { ipcRenderer } from 'electron';

interface ThemeContextContent {
  theme?: Theme;
  resetTheme: () => void;
  setTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextContent>({
  resetTheme: noop,
  setTheme: noop,
});

const ThemeProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, setState] = useState<Theme>();

  useEffect(() => {
    ipcRenderer.send(Channels.GET_THEME);
    ipcRenderer.on(Channels.THEME, (event, args: Theme) => {
      setState(args);
    });
  }, []);

  const setTheme = (themeName: string) => {
    ipcRenderer.send(Channels.SET_THEME, themeName);
  };

  const resetTheme = () => {
    ipcRenderer.send(Channels.RESET_THEME);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: state,
        resetTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { useTheme, ThemeProvider };
