import React, { PropsWithChildren, useEffect } from 'react';
import { Commands } from '@fm/common';
import { createApi, createStore } from 'effector';
import { warn } from 'electron-log';
import { omit } from 'lodash';

interface CommandsStore {
  [scope: string]: Commands;
}

const commandsStore = createStore<CommandsStore>({});

const commandsApi = createApi(commandsStore, {
  set: (
    state,
    value: {
      scope: string;
      commands: Commands;
    }
  ) => {
    return {
      ...state,
      [value.scope]: value.commands,
    };
  },
  unset: (state, value: string) => {
    if (!state[value]) {
      warn(`Cannot unset ${value} scope`);
      return state;
    }

    return omit(state, value);
  },
});

interface CommandsWrapperProps {
  scope: string;
  commands: Commands;
}

const CommandsWrapper = (props: PropsWithChildren<CommandsWrapperProps>) => {
  useEffect(() => {
    commandsApi.set({
      scope: props.scope,
      commands: props.commands,
    });

    return () => {
      commandsApi.unset(props.scope);
    };
  }, [props]);

  return <>{props.children}</>;
};

export { commandsStore, CommandsWrapper };
