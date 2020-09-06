import React from 'react';
import { Window } from './components';
import { Titlebar } from './components/Titlebar';
import './style.css';

const App = () => {
  return (
    <>
      <Titlebar />
      <Window />
    </>
  );
};

export { App };
