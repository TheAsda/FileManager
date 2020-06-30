import 'reflect-metadata';
import React from 'react';
import { App } from './App';
import { render } from 'react-dom';
import { configure } from 'react-hotkeys';

configure({
  // stopEventPropagationAfterIgnoring: false,
  // logLevel: 'debug',
  // simulateMissingKeyPressEvents: false,
  ignoreTags: ['input', 'select', 'textarea'],
});

render(<App />, document.getElementById('root'));
