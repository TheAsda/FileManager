import './style.css';

import React from 'react';
import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';

import { Window } from './components';
import { Titlebar } from './components/Titlebar';


const App = () => {
  return (
    <Provider value={new Client()}>
      <Titlebar />
      <Window />
    </Provider>
  );
};

export { App };
