import './style.css';

import React from 'react';
import { Client } from 'styletron-engine-atomic';
import { DebugEngine, Provider } from 'styletron-react';

import { Window } from './components';
import { Titlebar } from './components/Titlebar';

const App = () => {
  return (
    <Provider debug={new DebugEngine()} value={new Client()}>
      <Titlebar />
      <Window />
    </Provider>
  );
};

export { App };
