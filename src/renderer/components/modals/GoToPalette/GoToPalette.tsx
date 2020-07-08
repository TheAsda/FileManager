import React from 'react';
import './style.css';
import { KeyMap, Commands } from '@fm/common';
import { SelectPalette } from '../SelectPalette';

interface GoToPaletteProps {
  isOpened: boolean;
  onClose: () => void;
  options: string[];
  onSelect: (path: string) => void;
  initHotKeys: (keymap: KeyMap, commands: Commands) => void;
}

const GoToPalette = (props: GoToPaletteProps) => {
  return (
    <SelectPalette
      initHotKeys={props.initHotKeys}
      isOpened={props.isOpened}
      onClose={props.onClose}
      onSelect={props.onSelect}
      options={props.options}
    />
  );
};

export { GoToPalette, GoToPaletteProps };
