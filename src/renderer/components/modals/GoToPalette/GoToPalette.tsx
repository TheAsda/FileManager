import React from 'react';
import './style.css';
import { SelectPalette } from '../SelectPalette';
import { HOHandlers } from '@fm/components';

interface GoToPaletteProps extends HOHandlers {
  isOpened: boolean;
  onClose: () => void;
  options: string[];
  onSelect: (path: string) => void;
}

const GoToPalette = (props: GoToPaletteProps) => {
  return (
    <SelectPalette
      isOpened={props.isOpened}
      manager={props.manager}
      onClose={props.onClose}
      onSelect={props.onSelect}
      options={props.options}
    />
  );
};

export { GoToPalette, GoToPaletteProps };
