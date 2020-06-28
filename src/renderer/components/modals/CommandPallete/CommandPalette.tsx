import React from 'react';
import { keys } from 'lodash';
import { Options, SelectPalette } from '../SelectPalette';

interface CommandPaletteProps {
  isOpened: boolean;
  onClose: () => void;
  commands: Options;
}

const CommandPalette = (props: CommandPaletteProps) => {
  const onSelect = (selectedItem: string) => {
    props.commands[selectedItem]();
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
