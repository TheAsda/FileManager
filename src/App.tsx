import React from 'react';
import { render } from 'react-dom';
import { Window } from './components/Window';
import { CacheProvider } from '@fm/hooks';
import { KeymapProvider } from '@fm/hooks';
import './style.css';

render(
  <KeymapProvider>
    <CacheProvider>
      <Window />
    </CacheProvider>
  </KeymapProvider>,
  document.getElementById('root')
);
