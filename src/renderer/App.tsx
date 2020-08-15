import React from 'react';
import { Window } from './components';
import { CommandsProvider, ThemeProvider, useSettings, KeyMapProvider } from '@fm/hooks';
import './style.css';
import { Titlebar } from './components/Titlebar';

const App = () => {
  const { settings } = useSettings();

  return (
    <>
      <Titlebar />
      <ThemeProvider>
        <KeyMapProvider>
          {settings?.layout && (
            <CommandsProvider>
              <Window />
            </CommandsProvider>
          )}
        </KeyMapProvider>
      </ThemeProvider>
    </>
  );
};

export { App };
