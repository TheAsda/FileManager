import React from 'react';
import { Window } from './components';
import { CommandsProvider, ThemeProvider, KeyMapProvider } from '@fm/hooks';
import './style.css';
import { Titlebar } from './components/Titlebar';

const App = () => {
  return (
    <>
      {/* <Titlebar /> */}
      <ThemeProvider>
        <KeyMapProvider>
          <CommandsProvider>
            <Window />
          </CommandsProvider>
        </KeyMapProvider>
      </ThemeProvider>
    </>
  );
};

export { App };
