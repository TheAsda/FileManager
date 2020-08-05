import React, { useState, createContext, PropsWithChildren, useContext } from 'react';
import { useManagers } from './useManagers';
import { noop } from 'lodash';
import { Theme, DEFAULT_THEME } from '@fm/common';

interface ThemeContextContent {
  theme: Theme;
  resetTheme: () => void;
  setTheme: (themeName: string) => void;
}

const ThemeContext = createContext<ThemeContextContent>({
  theme: DEFAULT_THEME,
  resetTheme: noop,
  setTheme: noop,
});

const ThemeProvider = ({ children }: PropsWithChildren<unknown>) => {
  const { themesManager, settingsManager } = useManagers();
  const [themeName, setThemeName] = useState<string>(settingsManager.getSettings().theme);

  const resetTheme = () => {
    settingsManager.setSettings('theme', 'default');
    setThemeName('default');
  };

  const setTheme = (themeName: string) => {
    settingsManager.setSettings('theme', themeName);
    setThemeName(themeName);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themesManager.getTheme(themeName),
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
