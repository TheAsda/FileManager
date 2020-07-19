import React from 'react';
import './style.css';
import { SelectPalette } from '../SelectPalette';
import { HOHandlers } from 'renderer/components/common/HOHandlers';

interface GoToPaletteProps extends HOHandlers {
  isOpened: boolean;
  onClose: () => void;
  options: string[];
  onSelect: (path: string) => void;
}

const GoToPalette = (props: GoToPaletteProps) => {
  return (
    <SelectPalette
      commands={props.commands}
      hotkeys={props.hotkeys}
      isOpened={props.isOpened}
      manager={props.manager}
      onClose={props.onClose}
      onSelect={props.onSelect}
      options={props.options}
    />
  );
};

export { GoToPalette, GoToPaletteProps };
