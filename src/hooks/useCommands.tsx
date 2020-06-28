import React, { createContext, useReducer, useContext, Dispatch, ReactNode } from 'react';
import { noop, merge, forEach } from 'lodash';
import { Options } from 'renderer/components';

type Action =
  | {
      type: 'add';
      items: Options;
    }
  | {
      type: 'remove';
      items: Options;
    }
  | {
      type: 'empty';
    };

interface CommandsState {
  default: Options;
  custom: Options;
}

const commandsReducer = (state: CommandsState, action: Action): CommandsState => {
  console.log('state', state);
  console.log('action', action);
  switch (action.type) {
    case 'add': {
      return { ...state, custom: merge(state.custom, action.items) };
    }
    case 'remove':
      forEach(action.items, (item, key) => {
        delete state.custom[key];
      });
      return state;
    case 'empty': {
      return {
        ...state,
        custom: {},
      };
    }
  }
};

const CommandsContext = createContext<{ data: CommandsState; dispatch: Dispatch<Action> }>({
  data: {
    custom: {},
    default: {},
  },
  dispatch: noop,
});

const CommandsProvider = ({ children }: { children: ReactNode }) => {
  const [data, dispatch] = useReducer(commandsReducer, {
    custom: {},
    default: { default: () => console.log('keks') },
  });

  return <CommandsContext.Provider value={{ data, dispatch }}>{children}</CommandsContext.Provider>;
};

const useCommands = () => useContext(CommandsContext);

export { CommandsProvider, useCommands };
