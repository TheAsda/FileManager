import React from 'react';
import { keys } from 'lodash';
import { Commands, SelectPalette } from '../SelectPalette';
import { useTheme } from '@fm/hooks';

interface CommandPaletteProps {
  isOpened: boolean;
  onClose: () => void;
  commands: Commands;
}

const CommandPalette = (props: CommandPaletteProps) => {
  const { theme } = useTheme();

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
      theme={theme}
    />
  );
};

export { CommandPalette };
