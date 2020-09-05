import React from 'react';
import { Window } from './components';
import { ThemeProvider, KeyMapProvider } from '@fm/hooks';
import { Titlebar } from './components/Titlebar';
import './style.css';

const App = () => {
  return (
    <>
      <Titlebar />
      <ThemeProvider>
        <KeyMapProvider>
          <Window />
        </KeyMapProvider>
      </ThemeProvider>
    </>
  );
};

export { App };
