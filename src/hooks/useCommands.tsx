import React, { createContext, useReducer, useContext, Dispatch, ReactNode } from 'react';
import { noop, merge, forEach } from 'lodash';
import { Commands } from 'renderer/components';

type Action =
  | {
      type: 'add';
      items: Commands;
    }
  | {
      type: 'remove';
      items: string[];
    }
  | {
      type: 'empty';
    };

interface CommandsState {
  default: Commands;
  custom: Commands;
}

const commandsReducer = (state: CommandsState, action: Action): CommandsState => {
  switch (action.type) {
    case 'add': {
      return { ...state, custom: merge(state.custom, action.items) };
    }
    case 'remove':
      forEach(action.items, (item) => {
        delete state.custom[item];
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
    default: {},
  });

  return <CommandsContext.Provider value={{ data, dispatch }}>{children}</CommandsContext.Provider>;
};

const useCommands = () => useContext(CommandsContext);

export { CommandsProvider, useCommands };
