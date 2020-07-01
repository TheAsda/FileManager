import React from 'react';
import { keys } from 'lodash';
import { Commands, SelectPalette } from '../SelectPalette';
import { KeyMap } from '@fm/common';

interface CommandPaletteProps {
  isOpened: boolean;
  onClose: () => void;
  commands: Commands;
  initHotKeys: (keymap: KeyMap, commands: Commands) => void;
}

const CommandPalette = (props: CommandPaletteProps) => {
  const onSelect = (selectedItem: string) => {
    props.commands[selectedItem]();
    props.onClose();
  };

  return (
    <SelectPalette
      initHotKeys={props.initHotKeys}
      isOpened={props.isOpened}
      onClose={props.onClose}
      onSelect={onSelect}
      options={keys(props.commands)}
    />
  );
};

export { CommandPalette };
