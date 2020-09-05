import React from 'react';
import { Window } from './components';
import { KeyMapProvider } from '@fm/hooks';
import { Titlebar } from './components/Titlebar';
import './style.css';

const App = () => {
  return (
    <>
      <Titlebar />
      <KeyMapProvider>
        <Window />
      </KeyMapProvider>
    </>
  );
};

export { App };
