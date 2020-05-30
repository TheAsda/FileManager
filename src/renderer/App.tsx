import React from 'react';
import { Window } from './components';
import { CacheProvider, ManagersProvider } from '@fm/hooks';
import './style.css';

const App = () => {
  return (
    <ManagersProvider>
      <CacheProvider>
        <Window />
      </CacheProvider>
    </ManagersProvider>
  );
};

export { App };
