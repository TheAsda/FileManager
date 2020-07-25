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

const commandsReducer = (state: Commands, action: Action): Commands => {
  switch (action.type) {
    case 'add': {
      return merge(state, action.items);
    }
    case 'remove':
      forEach(action.items, (item) => {
        delete state[item];
      });
      return state;
    case 'empty': {
      return {};
    }
  }
};

const CommandsContext = createContext<{ data: Commands; dispatch: Dispatch<Action> }>({
  data: {},
  dispatch: noop,
});

const CommandsProvider = ({ children }: { children: ReactNode }) => {
  const [data, dispatch] = useReducer(commandsReducer, {});

  return <CommandsContext.Provider value={{ data, dispatch }}>{children}</CommandsContext.Provider>;
};

const useCommands = () => useContext(CommandsContext);

export { CommandsProvider, useCommands, Action };
