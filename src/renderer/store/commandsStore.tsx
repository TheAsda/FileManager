import { Commands } from '@fm/common';
import { createApi, createStore } from 'effector';
import { useStore } from 'effector-react';
import { warn } from 'electron-log';
import { includes, isEqual, keys, omit } from 'lodash';
import React, { PropsWithChildren, useEffect } from 'react';

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
  const store = useStore(commandsStore);

  useEffect(() => {
    if (includes(keys(store), props.scope) && isEqual(store[props.scope], props.commands)) {
      return;
    }

    commandsApi.set({
      scope: props.scope,
      commands: props.commands,
    });

    return () => {
      commandsApi.unset(props.scope);
    };
  }, [props.scope, props.commands]);

  return <>{props.children}</>;
};

export { commandsStore, CommandsWrapper };
