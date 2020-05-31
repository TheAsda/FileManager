import React from 'react';
import { keys } from 'lodash';
import { Option, SelectPalette } from '../SelectPalette';

interface CommandPaletteProps {
  isOpened: boolean;
  onClose: () => void;
  commands: Option;
}

const CommandPalette = (props: CommandPaletteProps) => {
  const onSelect = (selectedItem: string) => {
    props.commands[selectedItem]();
  };

  return (
    <SelectPalette
      options={keys(props.commands)}
      onClose={props.onClose}
      onSelect={onSelect}
      isOpened={props.isOpened}
    />
  );
};

export { CommandPalette };
