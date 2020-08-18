import React from 'react';
import { keys } from 'lodash';
import { Commands, SelectPalette } from '../SelectPalette';

interface CommandPaletteProps {
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
      isOpened={props.isOpened}
      onClose={props.onClose}
      onSelect={onSelect}
      options={keys(props.commands)}
    />
  );
};

export { CommandPalette };
