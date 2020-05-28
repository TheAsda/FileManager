import React from 'react';
import { Window } from './components';
import { CacheProvider } from '@fm/hooks';
import './style.css';

const App = () => {
  return (
    <CacheProvider>
      <Window />
    </CacheProvider>
  );
};

export { App };
