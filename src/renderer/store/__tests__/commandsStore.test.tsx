import { createEvent } from 'effector';
import { CommandsWrapper, commandsStore } from '../commandsStore';
import { render } from '@testing-library/react';
import { Commands } from '@fm/common';
import { keys, noop } from 'lodash';
import React from 'react';

describe('Commands store', () => {
  const reset = createEvent();
  commandsStore.reset(reset);

  beforeEach(() => {
    reset();
  });

  it('should be empty on init', () => {
    expect(commandsStore.getState()).toEqual({});
  });

  it('should add commands with Commands Wrapper', () => {
    const commands: Commands = {
      test1: noop,
      test2: noop,
    };
    render(<CommandsWrapper commands={commands} scope="test" />);

    expect(keys(commandsStore.getState())).toEqual(['test']);
    expect(commandsStore.getState()['test']).toEqual(commands);
  });

  it('should remove scope on unmount', () => {
    const commands: Commands = {
      test1: noop,
      test2: noop,
    };
    const { unmount } = render(<CommandsWrapper commands={commands} scope="test" />);

    unmount();

    expect(commandsStore.getState()).toEqual({});
  });
});
