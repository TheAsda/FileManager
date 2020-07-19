import React from 'react';
import { keys } from 'lodash';
import { Commands, SelectPalette } from '../SelectPalette';
import { HOHandlers } from 'renderer/components/common/HOHandlers';

interface CommandPaletteProps extends HOHandlers {
  isOpened: boolean;
  onClose: () => void;
  commands: Commands;
}

const CommandPalette = (props: CommandPaletteProps) => {
  const onSelect = (selectedItem: string) => {
    props.commands[selectedItem]();
    props.onClose();
  };

  return (
    <SelectPalette
      commands={props.commands}
      hotkeys={props.hotkeys}
      isOpened={props.isOpened}
      manager={props.manager}
      onClose={props.onClose}
      onSelect={onSelect}
      options={keys(props.commands)}
    />
  );
};

export { CommandPalette };
