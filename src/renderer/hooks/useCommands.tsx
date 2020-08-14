import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { noop, merge } from 'lodash';
import { Commands } from '@fm/common';

interface CommandsState {
  [key: string]: Commands;
}

const CommandsContext = createContext<{
  commands: CommandsState;
  addCommands: (commands: CommandsState) => void;
  removeCommands: (key: string) => void;
  emptyCommands: () => void;
}>({
  commands: {},
  addCommands: noop,
  emptyCommands: noop,
  removeCommands: noop,
});

const CommandsProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [state, setState] = useState<CommandsState>({});

  const addCommands = (commands: CommandsState) => {
    setState((state) => merge(state, commands));
  };

  const removeCommands = (key: string) => {
    setState((state) => {
      delete state[key];

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

interface CommandsProps {
  commands: Commands;
  scope: string;
}

const CommandsWrapper = (props: PropsWithChildren<CommandsProps>) => {
  const { addCommands, removeCommands } = useCommands();

  useEffect(() => {
    if (props.commands && props.scope) {
      addCommands({ [props.scope]: props.commands });

      return () => {
        removeCommands(props.scope);
      };
    }
  }, [props.commands]);

  return <>{props.children}</>;
};

export { CommandsProvider, useCommands, CommandsWrapper };
