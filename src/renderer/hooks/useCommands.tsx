import React, { createContext, useContext, useState, PropsWithChildren } from 'react';
import { noop, merge, forEach } from 'lodash';
import { Commands } from '@fm/common';

const CommandsContext = createContext<{
  commands: Commands;
  addCommands: (commands: Commands) => void;
  removeCommands: (commands: string[]) => void;
  emptyCommands: () => void;
}>({
  commands: {},
  addCommands: noop,
  emptyCommands: noop,
  removeCommands: noop,
});

const CommandsProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, setState] = useState<Commands>({});

  const addCommands = (commands: Commands) => {
    setState((state) => merge(state, commands));
  };

  const removeCommands = (commands: string[]) => {
    setState((state) => {
      forEach(commands, (command) => {
        delete state[command];
      });

      return state;
    });
  };

  const emptyCommands = () => {
    setState({});
  };

  return (
    <CommandsContext.Provider
      value={{ commands: state, addCommands, emptyCommands, removeCommands }}
    >
      {children}
    </CommandsContext.Provider>
  );
};

const useCommands = () => useContext(CommandsContext);

export { CommandsProvider, useCommands };
