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
  const [theme, setTheme] = useState<string>(settingsManager.getSettings().theme);

  const resetTheme = () => {
    settingsManager.setSettings('theme', 'default');
    setTheme('default');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themesManager.getTheme(theme),
        resetTheme: resetTheme,
        setTheme: noop,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { useTheme, ThemeProvider };
