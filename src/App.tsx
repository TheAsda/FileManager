import React from 'react';
import { render } from 'react-dom';
import { Window } from './components/Window';
import { CacheProvider } from '@fm/hooks';
import './style.css';

render(
  <CacheProvider>
    <Window />
  </CacheProvider>,
  document.getElementById('root')
);
