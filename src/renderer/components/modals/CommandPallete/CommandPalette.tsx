import React from 'react';
import { keys } from 'lodash';
import { Commands, SelectPalette } from '../SelectPalette';
import { HOHandlers } from '@fm/components';

interface CommandPaletteProps extends HOHandlers {
  isOpened: boolean;
  onClose: () => void;
  commands: Commands;
}

const CommandPalette = (props: CommandPaletteProps) => {
  const onSelect = (selectedItem: string) => {
    console.log(selectedItem);

    props.commands[selectedItem]();
    props.onClose();
  };

  return (
    <SelectPalette
      commands={props.commands}
      isOpened={props.isOpened}
      manager={props.manager}
      onClose={props.onClose}
      onSelect={onSelect}
      options={keys(props.commands)}
    />
  );
};

export { CommandPalette };
