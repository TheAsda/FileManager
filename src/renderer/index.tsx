import React from 'react';
import { App } from './App';
import { render } from 'react-dom';
import { init } from '@sentry/electron';
import { SettingsProvider } from '@fm/hooks';

if (process.env.NODE_ENV === 'production') {
  init({
    dsn: process.env.SENTRY_DSN,
  });
}

render(
  <SettingsProvider>
    <App />
  </SettingsProvider>,
  document.getElementById('root')
);
