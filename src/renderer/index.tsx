import 'reflect-metadata';
import React from 'react';
import { App } from './App';
import { render } from 'react-dom';
import { init } from '@sentry/electron';

if (process.env.NODE_ENV === 'production') {
  init({
    dsn: process.env.SENTRY_DSN,
  });
}

render(<App />, document.getElementById('root'));
